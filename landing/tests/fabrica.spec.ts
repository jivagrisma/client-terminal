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
    // Punto de agarre despejado (piso inferior-izquierdo): los hotspots son
    // botones y por diseño no inician arrastre (guardia de SceneCamera).
    const sx = box.x + box.width * 0.25;
    const sy = box.y + box.height * 0.7;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx + 140, sy, { steps: 6 });
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

test.describe("/es/fabrica · hotspots (T5)", () => {
  test("7 aros visibles con aria-label; los sprite-pendientes sin aro", async ({
    page,
  }) => {
    await page.goto("/es/fabrica");
    await expect(page.locator(".scene-hotspot")).toHaveCount(7);
    await expect(page.locator('.scene-hotspot[aria-label^="Copiloto"]')).toBeVisible();
    // Sin aro sobre escritorios vacíos (decisión del dueño, ADR-0007).
    await expect(page.locator('.scene-hotspot[aria-label^="Recepcionista"]')).toHaveCount(0);
    await expect(page.locator(".hotspots-hint")).toBeVisible();
  });

  test("click en copiloto: ficha con sus dos capas + zoom de cámara; Esc cierra", async ({
    page,
  }) => {
    await page.goto("/es/fabrica");
    await page.locator('.scene-hotspot[aria-label^="Copiloto"]').click();
    const card = page.getByRole("dialog", { name: "Copiloto" });
    await expect(card).toBeVisible();
    await expect(card).toContainText("Para tu negocio");
    await expect(card).toContainText("Scoring de viajes en tiempo real");
    const camera = page.locator(".scene-camera");
    const zoom = await camera.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--cam-zoom") || "1"),
    );
    expect(zoom).toBeGreaterThan(1.05);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("?focus=recepcionista abre su ficha aunque no tenga aro (R6)", async ({
    page,
  }) => {
    await page.goto("/es/fabrica?focus=recepcionista");
    await expect(
      page.getByRole("dialog", { name: "Recepcionista IA" }),
    ).toBeVisible();
    await expect(page.locator(".scene-hotspot")).toHaveCount(7);
  });
});
