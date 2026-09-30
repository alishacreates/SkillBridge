import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1024, 1440]) {
  test(`dashboard layout and accessibility at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    const apiRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("request", (request) => {
      if (new URL(request.url()).pathname.startsWith("/api/"))
        apiRequests.push(request.url());
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page
        .getByRole("region", { name: "Match overview" })
        .getByText("78%", { exact: true })
        .first(),
    ).toHaveCSS("white-space", "nowrap");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
    const desktop = page.getByRole("navigation", {
      name: "Desktop navigation",
    });
    if (width >= 1024) {
      await expect(desktop).toBeVisible();
      await expect(
        desktop.getByRole("link", { name: "Dashboard" }),
      ).toHaveAttribute("aria-current", "page");
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toBeHidden();
    } else {
      await expect(desktop).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toBeVisible();
    }
    await expect(
      page
        .getByRole("region", { name: "Recommended opportunities" })
        .getByRole("button", { name: /View sample details/ }),
    ).toHaveCount(3);
    await expect(
      page
        .getByRole("region", { name: "Recent applications" })
        .getByText("Interview", { exact: true }),
    ).toBeVisible();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    expect(apiRequests).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath(`dashboard-${width}.png`),
      fullPage: true,
    });
    await page.screenshot({
      path: test.info().outputPath(`dashboard-top-${width}.png`),
    });
    await page
      .getByRole("region", { name: "Match overview" })
      .screenshot({ path: test.info().outputPath(`chart-${width}.png`) });
    await page
      .getByRole("region", { name: "Recommended opportunities" })
      .screenshot({
        path: test.info().outputPath(`opportunities-${width}.png`),
      });
  });
}

test("mobile navigation opens, closes, restores focus, and survives responsive resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(nav.getByRole("link", { name: "Dashboard" })).toBeFocused();
  await expect(nav.getByRole("link", { name: "Dashboard" })).toHaveCSS(
    "outline-style",
    "solid",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: test.info().outputPath("mobile-menu-open.png"),
  });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(nav).toHaveCount(0);
  await trigger.click();
  await expect(nav.getByRole("link", { name: "Dashboard" })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(nav).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Desktop navigation" })
      .getByRole("link", { name: "Dashboard" }),
  ).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await nav.getByRole("link", { name: "Dashboard" }).press("Enter");
  await expect(nav).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("search and sample previews work without backend routes", async ({
  page,
}) => {
  await page.goto("/");
  const input = page.getByRole("textbox", {
    name: "Search sample opportunities",
  });
  await input.fill(" POSTGRESQL ");
  await input.press("Enter");
  const region = page.getByRole("region", {
    name: "Recommended opportunities",
  });
  await expect(
    region.getByRole("button", { name: /View sample details/ }),
  ).toHaveCount(1);
  await expect(region.getByText("Northstar Technologies")).toBeVisible();
  const detail = region.getByRole("button", { name: /View sample details/ });
  await detail.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: /^Sample details:/ }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Close sample details" }).click();
  await expect(detail).toBeFocused();
  await input.fill("no-such-company");
  await input.press("Enter");
  await expect(
    region.getByRole("heading", { name: "No matching samples" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(input).toBeFocused();
  await expect(
    region.getByRole("button", { name: /View sample details/ }),
  ).toHaveCount(3);
  await page.getByRole("link", { name: /Explore learning steps/ }).click();
  await expect(
    page.getByRole("heading", { name: "Learning recommendations" }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Preview topics — Jest testing fundamentals" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Learning outline: Jest testing fundamentals",
    }),
  ).toBeFocused();
  await expect(page.getByText("Arrange, act, assert")).toBeVisible();
});

test("explicit recommendation variants are accessible and recover to sample data", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3102/#dashboard-states");
  const fixture = page.getByRole("region", { name: "Dashboard state fixture" });
  for (const state of ["loading", "empty", "error"] as const) {
    await fixture.getByRole("button", { name: `Show ${state} state` }).click();
    const audit = await new AxeBuilder({ page })
      .include("#dashboard-states")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await fixture.screenshot({
      path: test.info().outputPath(`recommendations-${state}.png`),
    });
  }
  await fixture.getByRole("button", { name: "Restore sample data" }).click();
  await expect(
    fixture.getByRole("button", { name: /View sample details/ }),
  ).toHaveCount(3);
});
