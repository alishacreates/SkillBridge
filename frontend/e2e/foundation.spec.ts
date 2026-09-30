import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1440]) {
  test(`dashboard preserves fonts and foundation within ${width}px viewport`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveTitle("Student Dashboard — SkillBridge");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Welcome back, Aarav.",
    );
    await expect(page.getByRole("main")).toHaveCount(1);
    const rendering = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const note = document.querySelector("[data-brand-note]");
      if (!note) throw new Error("Brand note missing");
      const decorative = getComputedStyle(note).fontFamily;
      const fonts = Array.from(document.fonts);
      const loaded = (family: string) =>
        fonts.some(
          (font) =>
            family.includes(font.family.replaceAll('"', "")) &&
            font.status === "loaded",
        );
      return {
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
        background: body.backgroundColor,
        text: body.color,
        interLoaded: loaded(body.fontFamily),
        felipaLoaded: loaded(decorative),
        distinctFonts: body.fontFamily !== decorative,
        scrollbar: body.scrollbarColor,
      };
    });
    expect(rendering).toMatchObject({
      overflow: false,
      background: "rgb(243, 252, 240)",
      text: "rgb(31, 39, 27)",
      interLoaded: true,
      felipaLoaded: true,
      distinctFonts: true,
    });
    expect(rendering.scrollbar).not.toBe("auto");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    await page.getByRole("main").evaluate((element) => element.blur());
    await page.screenshot({
      path: test.info().outputPath(`dashboard-foundation-${width}.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test("reduced motion and forced colors preserve the accessibility foundation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS("outline-style", "solid");
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--motion-normal")
        .trim(),
    ),
  ).toMatch(/^0(?:ms|s)$/);
  await expect(page.locator("body")).toHaveCSS("scrollbar-color", "auto");
});

test("intended text and surface token pairs meet AA normal-text contrast", async ({
  page,
}) => {
  await page.goto("/");
  const pairs = await page.evaluate(() => {
    // Read resolved RGB values: production CSS may shorten hex colors or use names.
    const probe = document.createElement("span");
    document.body.append(probe);
    const luminance = (token: string) => {
      probe.style.color = `var(${token})`;
      const channels = getComputedStyle(probe).color.match(/[\d.]+/g);
      const channel = (index: number) => {
        const raw = channels?.[index];
        if (raw === undefined)
          throw new Error(`Expected RGB color for ${token}`);
        const value = Number(raw) / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      };
      return channel(0) * 0.2126 + channel(1) * 0.7152 + channel(2) * 0.0722;
    };
    const tokens: [string, string][] = [];
    for (const text of ["primary", "secondary", "muted"]) {
      for (const surface of ["canvas", "surface", "surface-subtle"]) {
        tokens.push([`--color-text-${text}`, `--color-${surface}`]);
      }
    }
    for (const role of ["success", "warning", "error", "info"]) {
      tokens.push([`--color-${role}`, `--color-${role}-surface`]);
    }
    for (const hue of [
      "purple",
      "pink",
      "yellow",
      "green",
      "blue",
      "cyan",
      "orange",
    ]) {
      tokens.push([`--chart-${hue}`, "--color-surface"]);
    }
    tokens.push(["--color-brand-primary", "--color-canvas"]);
    tokens.push(["--color-text-inverse", "--color-brand-primary"]);
    const results = tokens.map(([foreground, background]) => {
      const a = luminance(foreground);
      const b = luminance(background);
      return {
        foreground,
        background,
        ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
      };
    });
    probe.remove();
    return results;
  });
  for (const pair of pairs) {
    expect(
      pair.ratio,
      `${pair.foreground} on ${pair.background}`,
    ).toBeGreaterThanOrEqual(4.5);
  }
});
