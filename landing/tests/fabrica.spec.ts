import { expect, test } from "@playwright/test";

// /fabrica (ADR-0006, T4): escena a pantalla completa con cámara 2D.
// Las interacciones reales de puntero/teclado se verifican contra el build de
// producción leyendo las variables --cam-* que SceneCamera escribe por ref.
test.describe("/es/fabrica", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es/fabrica");
  });

  test("carga escena, botón Vista general y enlace Volver; sin overflow", async ({
    page,
  }) => {
    await expect(page.locator(".scene-stage")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Vista general" }),
    ).toBeVisible();
    await expect(page.locator(".fabrica-back")).toHaveAttribute("href", "/es");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= window.innerWidth &&
          document.documentElement.scrollHeight <= window.innerHeight + 1,
      ),
    ).toBe(true);
  });

  test("la rueda acerca y el arrastre panea (--cam-x cambia)", async ({ page }) => {
    const camera = page.locator(".scene-camera");
    await camera.hover();
    await page.mouse.wheel(0, -600); // zoom in
    const zoom = await camera.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--cam-zoom") || "1"),
    );
    expect(zoom).toBeGreaterThan(1.05);

    const box = await camera.boundingBox();
    if (!box) throw new Error("la cámara no tiene caja visible");
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 140, cy, { steps: 6 });
    await page.mouse.up();
    const camX = await camera.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--cam-x") || "0"),
    );
    expect(camX).toBeGreaterThan(0);
  });

  test("Esc y Vista general devuelven a la identidad", async ({ page }) => {
    const camera = page.locator(".scene-camera");
    await camera.click(); // foco (tabIndex=0) sin arrastre
    await page.keyboard.press("+");
    await page.keyboard.press("+");
    let zoom = await camera.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--cam-zoom") || "1"),
    );
    expect(zoom).toBeGreaterThan(1.05);

    await page.keyboard.press("Escape");
    zoom = await camera.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--cam-zoom") || "1"),
    );
    expect(zoom).toBe(1);

    // Zoom de nuevo y botón "Vista general": mismo destino programático.
    await page.keyboard.press("+");
    await page.getByRole("button", { name: "Vista general" }).click();
    zoom = await camera.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--cam-zoom") || "1"),
    );
    expect(zoom).toBe(1);
  });

  test("sitemap y hreflang anuncian /fabrica", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const body = await sitemap.text();
    expect(body).toContain("/es/fabrica");
    expect(body).toContain("/en/fabrica");
  });
});
