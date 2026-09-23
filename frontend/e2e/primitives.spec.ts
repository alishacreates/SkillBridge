import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:3102/");
  await page.evaluate(() => document.fonts.ready);
});

for (const width of [390, 1440]) {
  test(`primitive states render accessibly at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath(`primitives-${width}.png`),
      fullPage: true,
    });
  });
}

test("buttons preserve size when busy, prevent repeat activation, and expose focus/hover/active states", async ({
  page,
}) => {
  const button = page.getByRole("button", {
    name: "Run operation",
    exact: true,
  });
  const before = await button.boundingBox();
  await button.click();
  const busy = page.getByRole("button", { name: /Run operation/ });
  await expect(busy).toBeDisabled();
  await expect(busy).toHaveAttribute("aria-busy", "true");
  const after = await busy.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  await page.getByRole("button", { name: "Reset operation" }).click();
  await expect(button).toBeEnabled();

  for (const variant of [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "destructive",
  ]) {
    const target = page.getByRole("button", {
      name: `${variant} action`,
      exact: true,
    });
    await page.mouse.move(0, 0);
    const normal = await target.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await target.hover();
    await expect
      .poll(() =>
        target.evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .not.toBe(normal);
    const hoverAudit = await new AxeBuilder({ page })
      .include(`[data-testid="row-${variant}"]`)
      .withRules(["color-contrast"])
      .analyze();
    expect(hoverAudit.violations).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath(`${variant}-hover.png`),
      fullPage: false,
    });
    const hovered = await target.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.mouse.down();
    await expect
      .poll(() =>
        target.evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .not.toBe(hovered);
    await expect(target).toHaveCSS("cursor", "pointer");
    const activeAudit = await new AxeBuilder({ page })
      .include(`[data-testid="row-${variant}"]`)
      .withRules(["color-contrast"])
      .analyze();
    expect(activeAudit.violations).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath(`${variant}-pressed.png`),
      fullPage: false,
    });
    await page.mouse.up();
  }
  await page.reload();
  await page.keyboard.press("Tab");
  const first = page.getByRole("button", {
    name: "primary action",
    exact: true,
  });
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS("outline-style", "solid");
  await page.screenshot({
    path: test.info().outputPath("keyboard-focus.png"),
    fullPage: false,
  });
  await page.keyboard.press("Enter");
  await expect(page.locator("output")).toHaveText("primary activated");
});

test("native fields support keyboard selection and programmatic error descriptions", async ({
  page,
}) => {
  const checkbox = page.getByRole("checkbox", { name: "Send updates" });
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();

  const daily = page.getByRole("radio", { name: "Daily", exact: true });
  await daily.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("radio", { name: "Weekly", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("radio", { name: "Unavailable", exact: true }),
  ).not.toBeChecked();

  const select = page.getByRole("combobox", { name: /Color/ });
  await select.focus();
  // Native typeahead + commit works without automating an OS-owned popup.
  await page.keyboard.press("b");
  await page.keyboard.press("Tab");
  await expect(select).toHaveValue("blue");
  await page.screenshot({
    path: test.info().outputPath("native-select-activation.png"),
  });
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toHaveAccessibleDescription("Error: Enter a complete email address.");
  await expect(
    page.getByRole("textbox", { name: "Notes", exact: true }),
  ).toHaveCSS("resize", "vertical");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("output")).toHaveText("Retry activated");
});

test("reduced motion and forced colors preserve primitive usability", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await expect(page.locator('[data-shape="block"]')).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "primary action", exact: true }),
  ).toHaveCSS("outline-style", "solid");
  await expect(
    page.getByRole("button", { name: "Unavailable", exact: true }).first(),
  ).toBeDisabled();
  await page.screenshot({
    path: test.info().outputPath("forced-colors.png"),
    fullPage: true,
  });
});
