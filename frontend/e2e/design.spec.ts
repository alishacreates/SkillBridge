import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1024, 1440]) {
  test(`design reference layout and accessibility at ${width}px`, async ({
    page,
  }) => {
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
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/design");
    await page.evaluate(() => document.fonts.ready);
    expect(errors).toEqual([]);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(243, 252, 240)",
    );
    await expect(page).toHaveTitle("Design System — SkillBridge");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "SkillBridge Design System",
    );
    await expect(page.locator("main h2")).toHaveCount(10);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(errors).toEqual([]);
    expect(apiRequests).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath(`design-top-${width}.png`),
    });
    for (const id of [
      "data-viz",
      "typography",
      "primitives",
      "domain",
      "states",
    ]) {
      await page
        .locator(`#${id}`)
        .screenshot({
          path: test.info().outputPath(`design-${id}-${width}.png`),
        });
    }
  });
}

test("specimen labels agree with runtime tokens and actual computed styles", async ({
  page,
}) => {
  await page.goto("/design");
  const colors = await page
    .locator("[data-color-token]")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const token = element.getAttribute("data-color-token") ?? "";
        const hex = element.getAttribute("data-hex") ?? "";
        const style = getComputedStyle(element);
        const probe = document.createElement("span");
        probe.style.color = `var(${token})`;
        element.appendChild(probe);
        const resolved = getComputedStyle(probe).color;
        probe.remove();
        const parts = hex
          .slice(1)
          .match(/.{2}/g)
          ?.map((part) => parseInt(part, 16));
        return {
          token,
          declared: style.getPropertyValue(token).trim().toUpperCase(),
          hex,
          resolved,
          expected: `rgb(${parts?.join(", ")})`,
          painted:
            element.tagName.toLowerCase() === "rect"
              ? style.fill
              : style.backgroundColor,
        };
      }),
    );
  expect(colors).toHaveLength(16);
  for (const color of colors) {
    expect(color.declared, color.token).toBe(color.hex);
    expect(color.painted, color.token).toBe(color.expected);
    expect(color.resolved, color.token).toBe(color.expected);
  }
  for (const size of [1, 2, 3, 4, 6, 8, 12, 16]) {
    await expect(page.locator(`[data-space="${size}"]`)).toHaveCSS(
      "width",
      `${size * 4}px`,
    );
  }
  for (const [size, radius] of Object.entries({
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  })) {
    await expect(page.locator(`[data-radius="${size}"]`)).toHaveCSS(
      "border-radius",
      `${radius}px`,
    );
  }
  await expect(page.locator('[data-type="body"]')).toHaveCSS(
    "font-size",
    "16px",
  );
  await expect(page.locator('[data-type="caption"]')).toHaveCSS(
    "font-size",
    "12px",
  );
  await expect(page.locator('[data-type="body"]')).toHaveCSS(
    "font-family",
    /Inter/,
  );
  for (const accent of await page.locator("[data-design-felipa]").all())
    await expect(accent).toHaveCSS("font-family", /Felipa/);
});

test("keyboard navigation, real button states, and feedback recovery", async ({
  page,
}) => {
  await page.goto("/design");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await page
    .getByRole("navigation", { name: "Design system sections" })
    .getByRole("link", { name: /Component states/ })
    .click();
  await expect(page.locator("#states-heading")).toBeFocused();
  await page.keyboard.press("Tab");
  const target = page.getByRole("button", { name: "Interaction target" });
  await expect(target).toBeFocused();
  await expect(target).toHaveCSS("outline-style", "solid");
  await page.locator("#states").screenshot({
    path: test.info().outputPath("focus-visible.png"),
  });
  const normal = await target.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await target.hover();
  await expect
    .poll(() =>
      target.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .not.toBe(normal);
  await target.screenshot({ path: test.info().outputPath("hover.png") });
  await page.keyboard.down("Space");
  expect(await target.evaluate((element) => element.matches(":active"))).toBe(
    true,
  );
  await target.screenshot({ path: test.info().outputPath("active.png") });
  await page.keyboard.up("Space");
  await expect(page.getByText("Activations: 1", { exact: true })).toBeVisible();
  const lab = page.locator("#states");
  const action = lab.getByRole("button", { name: "State action" });
  const before = await action.boundingBox();
  await lab.getByRole("checkbox", { name: "Show loading" }).check();
  const busy = lab.getByRole("button", { name: "Loading state example" });
  await expect(busy).toBeDisabled();
  expect((await busy.boundingBox())?.width).toBe(before?.width);
  await lab.screenshot({
    path: test.info().outputPath("loading-disabled.png"),
  });
  await lab.getByRole("checkbox", { name: "Show loading" }).uncheck();
  await lab.getByRole("checkbox", { name: "Show disabled" }).check();
  await expect(action).toBeDisabled();
  await lab.getByRole("checkbox", { name: "Show disabled" }).uncheck();
  for (const state of ["Loading", "Empty", "Error"]) {
    await lab.getByRole("radio", { name: state, exact: true }).check();
    expect(
      (
        await new AxeBuilder({ page })
          .include("#states")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await lab.screenshot({
      path: test.info().outputPath(`${state.toLowerCase()}-content.png`),
    });
    if (state !== "Loading") {
      const recovery = lab.getByRole("button", {
        name: state === "Empty" ? "Restore example" : "Reset error example",
      });
      // Reserved panel space must not stretch its shared Button.
      expect((await recovery.boundingBox())?.height).toBe(before?.height);
      await lab
        .getByRole("button", {
          name: state === "Empty" ? "Restore example" : "Reset error example",
        })
        .click();
      await expect(lab.getByRole("radio", { name: "Ready" })).toBeFocused();
      await expect(lab.getByRole("radio", { name: "Ready" })).toBeChecked();
    }
  }
});

test("native fields validate locally, preserve input, and support keyboard choices", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/design");
  await page.getByRole("button", { name: "Check example" }).click();
  const input = page.getByRole("textbox", { name: /Required example name/ });
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAccessibleDescription(/Enter a name/);
  await input.fill("An example with a realistic long name");
  await input.press("Enter");
  await expect(input).toHaveValue("An example with a realistic long name");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  const select = page.getByRole("combobox", { name: "Example format" });
  await select.focus();
  // Native typeahead; popup geometry remains browser/OS-owned.
  await select.press("c");
  await select.press("Tab");
  await expect(select).toHaveValue("compact");
  await page
    .locator("#primitives")
    .screenshot({ path: test.info().outputPath("native-fields-mobile.png") });
});

test("dashboard and reference link to each other without fake product routes", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Design system", exact: true }).click();
  await expect(page).toHaveURL(/\/design$/);
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3101/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Welcome back",
  );
});

test("narrow reflow, reduced motion and forced colors retain meaning and focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.goto("/design");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  ).toBe(false);
  await expect(page.getByText("Cyan · 38 examples")).toBeVisible();
  const target = page.getByRole("button", { name: "Interaction target" });
  await target.focus();
  await expect(target).toHaveCSS("outline-style", "solid");
  await expect(target).toHaveCSS("transition-duration", "1e-05s");
  await page
    .locator("#states")
    .screenshot({ path: test.info().outputPath("forced-colors-320.png") });
});
