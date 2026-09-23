import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1440]) {
  test(`domain compositions wrap and remain accessible at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:3102/#domain-fixture");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
    const domain = page.locator("#domain-fixture");
    await expect(domain.getByText("Excellent Match").first()).toBeVisible();
    await expect(domain.getByText("Low Match").first()).toBeVisible();
    await expect(
      domain.getByRole("heading", {
        name: "Frontend engineering intern — accessible developer platforms and collaboration tools",
      }),
    ).toBeVisible();
    const audit = await new AxeBuilder({ page })
      .include("#domain-fixture")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    await domain.screenshot({
      path: test.info().outputPath(`domain-${width}.png`),
    });
    await page
      .getByRole("region", { name: "Opportunity card examples" })
      .screenshot({
        path: test.info().outputPath(`opportunities-${width}.png`),
      });
    await page.getByRole("region", { name: "Candidate examples" }).screenshot({
      path: test.info().outputPath(`candidates-${width}.png`),
    });
  });
}

test("domain actions remain keyboard operable, contextual, and busy-safe", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3102/#domain-fixture");
  const domain = page.locator("#domain-fixture");
  const remove = domain.getByRole("button", {
    name: "Remove Docker",
    exact: true,
  });
  await remove.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(remove).toBeFocused();
  await expect(remove).toHaveCSS("outline-style", "solid");
  const bounds = await remove.boundingBox();
  expect(bounds?.height).toBeGreaterThanOrEqual(44);
  await page.screenshot({
    path: test.info().outputPath("domain-keyboard-focus.png"),
  });
  await page.keyboard.press("Enter");
  await expect(domain.getByTestId("domain-feedback")).toHaveText(
    "Docker removed from fixture",
  );
  await expect(remove).toHaveCount(0);
  await expect(
    domain.getByRole("button", { name: "Remove Required fixture skill" }),
  ).toBeDisabled();

  const candidate = domain.getByRole("button", {
    name: "View profile — Asha Patel",
    exact: true,
  });
  await candidate.focus();
  await page.keyboard.press("Enter");
  await expect(domain.getByTestId("domain-feedback")).toHaveText(
    "Asha Patel profile selected",
  );

  const preview = domain.getByRole("button", {
    name: "Preview application — Data engineering internship",
  });
  const before = await preview.boundingBox();
  await preview.hover();
  await preview.click();
  await expect(preview).toBeDisabled();
  await expect(preview).toHaveAttribute("aria-busy", "true");
  const after = await preview.boundingBox();
  expect(after?.height).toBe(before?.height);
  expect(after?.width).toBe(before?.width);
  await page.screenshot({ path: test.info().outputPath("domain-loading.png") });

  const link = domain.getByRole("link", { name: /^View opportunity/ });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#fixture-details$/);
  await expect(page.locator("#fixture-details")).toBeFocused();
});

test("domain meanings survive forced colors and narrow reflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3102/#domain-fixture");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  ).toBe(false);
  const domain = page.locator("#domain-fixture");
  await expect(domain.getByText("Due soon")).toBeVisible();
  await expect(domain.getByText("Rejected").first()).toBeVisible();
  await expect(
    domain.getByRole("progressbar", { name: "Profile completion" }),
  ).toHaveAttribute("aria-valuetext", "75%; 6 of 8 items complete");
  await domain.screenshot({
    path: test.info().outputPath("domain-forced-colors.png"),
  });
});
