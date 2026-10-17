import { test, expect } from "@playwright/test";

test("KRS simulation queues requests, pauses, and clears overload with optimizations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Traffic spike", exact: true })
    .click();
  await expect(page.locator(".experiment-status")).toContainText("BOTTLENECK");
  await expect
    .poll(async () =>
      Number(
        (
          await page.locator(".sim-dashboard strong").nth(2).innerText()
        ).replace("+", ""),
      ),
    )
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Jeda simulasi", exact: true })
    .click();
  const count = await page.locator(".sim-dashboard strong").nth(2).innerText();
  await page.waitForTimeout(700);
  await expect(page.locator(".sim-dashboard strong").nth(2)).toHaveText(count);
  await page
    .getByRole("button", { name: "Redis cache OFF", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Database index OFF", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Lanjut simulasi", exact: true })
    .click();
  await expect(page.locator(".experiment-status")).toContainText("FLOW STABLE");
  await expect(page.locator(".sim-dashboard strong").nth(2)).toHaveText("0", {
    timeout: 30000,
  });
  await expect(page.locator("#arcade .section-label")).toContainText("1 / 3");
  await page.getByRole("button", { name: "Reset KRS ↺", exact: true }).click();
  await expect(
    page.getByRole("slider", { name: "Beban request KRS" }),
  ).toHaveValue("180");
});

test("arcade tabs, debugging explanations, campus toggles and mission progress work by keyboard", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page.getByRole("tab").first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab").nth(1)).toBeFocused();
  await page.getByRole("button", { name: /Naikkan maxSks/ }).click();
  await expect(page.locator(".debug-feedback")).toContainText(
    "Bug belum teratasi",
  );
  await page.getByRole("button", { name: /Periksa currentSks/ }).click();
  await expect(page.locator(".debug-code")).toContainText(
    "currentSks + course.sks",
  );
  await page.getByRole("button", { name: "Bug berikutnya ↗" }).click();
  await page
    .getByRole("button", { name: /Gunakan key dengan studentId/ })
    .click();
  await page.getByRole("button", { name: "Bug berikutnya ↗" }).click();
  await page.getByRole("button", { name: /Transaksi \+ kunci row/ }).click();
  await expect(page.locator(".debug-challenge")).toContainText(
    "3 / 3 — READY TO SHIP",
  );
  await page.getByRole("tab").last().click();
  for (const name of [
    "LEARNING SPACE LMS",
    "FINANCE GATEWAY PAYMENTS",
    "REPORTING BRIDGE PDDIKTI",
  ])
    await page.getByRole("button", { name, exact: true }).click();
  await expect(page.locator(".campus-node.online")).toHaveCount(4);
  await expect(page.locator("#arcade .section-label")).toContainText("2 / 3");
  await page.getByRole("button", { name: "Reset kampus ↺" }).click();
  await expect(page.locator(".campus-node.online")).toHaveCount(0);
  await page.getByRole("tab").nth(1).click();
  await expect(page.locator(".debug-challenge")).toContainText("READY TO SHIP");
  await page.getByRole("button", { name: "Ulangi challenge ↺" }).click();
  await expect(page.locator(".debug-progress")).toHaveAttribute(
    "aria-label",
    "Tantangan 1 dari 3",
  );
});

test("secret terminal handles history, unknown commands, navigation and focus restoration", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  const launcher = page.getByRole("button", { name: "Buka terminal rahasia" });
  await launcher.click();
  const input = page.getByRole("textbox", { name: "Perintah terminal" });
  await expect(input).toBeFocused();
  await input.fill("help");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("sudo hire bayu");
  await input.fill("<script>bad()</script>");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("belum dikenal");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("<script>bad()</script>");
  await input.fill("sudo hire bayu");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText(
    "bayufirmansyah.me@gmail.com",
  );
  await page.keyboard.press("Escape");
  await expect(launcher).toBeFocused();
  await page.keyboard.press("~");
  await expect(input).toBeVisible();
  await input.fill("play");
  await input.press("Enter");
  await expect(page.locator(".secret-terminal")).not.toBeVisible();
  await expect(page.locator("#arcade")).toBeFocused();
});

test("gravity supports keyboard, pause, architecture arrangement and calm mode", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page.locator(".gravity-stage").scrollIntoViewIfNeeded();
  const chip = page.getByRole("button", {
    name: "REACT: lontarkan skill",
    exact: true,
  });
  await chip.focus();
  await chip.press("Enter");
  await expect(page.locator(".gravity-footer [role=status]")).toContainText(
    "REACT / Membangun antarmuka",
  );
  await page
    .getByRole("button", { name: "Jeda gravitasi", exact: true })
    .click();
  const before = await chip.getAttribute("style");
  await page.waitForTimeout(200);
  expect(await chip.getAttribute("style")).toBe(before);
  await page
    .getByRole("button", { name: "Build architecture ↗", exact: true })
    .click();
  await expect(page.locator(".gravity-lanes")).toBeVisible();
  await page
    .getByRole("button", { name: "Lepaskan gravitasi ↗", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Aktifkan mode tenang", exact: true })
    .click();
  await expect(page.locator(".gravity-lanes")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Lepaskan gravitasi ↗", exact: true }),
  ).toBeDisabled();
});

test("overdrive releases, times out, and respects reduced motion", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  const boost = page.getByRole("button", { name: "Tahan untuk Overdrive" });
  await boost.scrollIntoViewIfNeeded();
  await expect(boost).toBeEnabled();
  await boost.focus();
  await page.keyboard.down("Space");
  await expect(boost).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.up("Space");
  await expect(boost).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.down("Space");
  await expect(boost).toHaveAttribute("aria-pressed", "true");
  await expect(boost).toHaveAttribute("aria-pressed", "false", {
    timeout: 4500,
  });
  await page.keyboard.up("Space");
  const box = await boost.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await expect(boost).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(5, 5);
  await page.mouse.up();
  await expect(boost).toHaveAttribute("aria-pressed", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(boost).toBeDisabled();
  expect(errors).toEqual([]);
});

test("every arcade panel fits small screens and calm remains functional", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".preloader")).toHaveCount(0);
    for (let i = 0; i < 3; i++) {
      await page.getByRole("tab").nth(i).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const panel = page.getByRole("tabpanel");
      expect(
        await panel.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
    }
    await page.getByRole("button", { name: "Buka terminal rahasia" }).click();
    await expect(page.locator(".secret-terminal")).toBeVisible();
    await page.keyboard.press("Escape");
  }
});
