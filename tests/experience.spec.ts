import { test, expect } from "@playwright/test";

test("architecture playground supports keyboard, rejects mismatches, and resets", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  const module = (name: string) =>
    page.locator(".system-module").filter({ hasText: name });
  await module("DATABASE").focus();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Slot 01: INTERFACE", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator(".playground-bottom").getByRole("status"),
  ).toContainText("Belum cocok");
  for (const [i, name] of [
    "INTERFACE",
    "API",
    "DATABASE",
    "DEPLOY",
  ].entries()) {
    await module(name).focus();
    await page.keyboard.press("Enter");
    await page
      .getByRole("button", { name: `Slot 0${i + 1}: ${name}`, exact: true })
      .focus();
    await page.keyboard.press("Enter");
  }
  await expect(
    page.locator(".playground-bottom").getByRole("status"),
  ).toContainText("System connected");
  await expect(page.locator(".system-slot.connected")).toHaveCount(4);
  await page.getByRole("button", { name: "Main lagi", exact: true }).click();
  await expect(page.locator(".system-slot.connected")).toHaveCount(0);
  await expect(module("DATABASE")).toBeEnabled();
});

test("dragging modules connects the correct slot without breaking subsequent selection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page.locator(".system-playground").scrollIntoViewIfNeeded();
  const from = await page
    .locator(".system-module")
    .filter({ hasText: "DATABASE" })
    .boundingBox();
  const to = await page.locator('[data-slot="2"]').boundingBox();
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2);
  await page.mouse.down();
  await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
  await expect(page.locator('[data-slot="2"]')).toHaveClass(/connected/);
  await page.locator(".system-module").filter({ hasText: "API" }).click();
  await page.getByRole("button", { name: "Slot 02: API", exact: true }).click();
  await expect(page.locator(".system-slot.connected")).toHaveCount(2);
});

test("full motion can be switched off and restored without duplicate scroll effects", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Acak huruf", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Acak huruf", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Susun kembali huruf", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Acak huruf", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  for (let i = 0; i < 2; i++) {
    await page
      .getByRole("button", { name: "Aktifkan mode tenang", exact: true })
      .click();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Acak huruf", exact: true }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Aktifkan animasi penuh", exact: true })
      .click();
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test("mobile and reduced motion retain all content without horizontal overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".preloader")).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
  }
  await page
    .getByRole("button", { name: "Lihat studi kasus SiakadCloud", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("3D controls change the experiment and calm mode keeps the reader in place", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page.locator("#lab").scrollIntoViewIfNeeded();
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.getByRole("button", { name: "ORB", exact: true }).click();
  await page.getByRole("button", { name: "WIREFRAME", exact: true }).click();
  await page.getByRole("button", { name: "EXPAND ↗", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "ORB", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "WIREFRAME", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("slider", { name: "Intensitas gerakan 3D" }).focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("slider", { name: "Intensitas gerakan 3D" }),
  ).toHaveValue("100");
  await page
    .getByRole("button", { name: "Reset rotasi 3D", exact: true })
    .click();
  await expect(
    page.getByRole("slider", { name: "Intensitas gerakan 3D" }),
  ).toHaveValue("20");
  await page.locator(".system-playground").scrollIntoViewIfNeeded();
  const before = await page
    .locator(".system-playground")
    .evaluate((el) => el.getBoundingClientRect().top);
  await page
    .getByRole("button", { name: "Aktifkan mode tenang", exact: true })
    .click();
  const after = await page
    .locator(".system-playground")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(after - before)).toBeLessThan(5);
  await expect(
    page.getByRole("slider", { name: "Intensitas gerakan 3D" }),
  ).toBeDisabled();
  expect(errors).toEqual([]);
});

test("full motion mobile remains within the viewport", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".preloader")).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(width);
  }
});
