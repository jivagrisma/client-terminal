import { expect, test } from "@playwright/test";

// Home dual (T8, ADR-0006): móvil <1024px = home tipo app (cabecera avatar/
// pregunta/+, chips, tarjeta de escena con "Entrar a la fábrica", filas);
// escritorio ≥1024px = oficina animada con el hero de siempre. Un solo CTA
// primario por pantalla.
test.describe("home móvil (390×844) — home tipo app", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("cabecera app con pregunta, '+' crear y menú de avatar", async ({
    page,
  }) => {
    await page.goto("/es");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "¿Tienes un hotel, una finca o un negocio?",
    );
    await expect(page.locator(".site-header")).toBeHidden(); // reemplazada por la app
    await expect(page.locator(".mobile-cta-bar")).toBeHidden(); // "+" es el primario

    const create = page.locator(".app-create");
    await expect(create).toHaveAttribute("href", "/es/crear");
    await expect(create).toContainText("Crear empleado");

    await page.locator(".app-avatar").click();
    const panel = page.locator("#app-menu-panel");
    await expect(panel).toBeVisible();
    await expect(panel.locator('a[href$="/ingeniero"]')).toBeVisible();
    await expect(panel).toContainText("Soy técnico");
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });

  test("chips filtran las filas; 'Próximamente' sin enlace; tarjeta entra a /fabrica", async ({
    page,
  }) => {
    await page.goto("/es");

    // Negocio por defecto: Recepcionista viva → /fabrica?focus; Experto Legal → Próximamente.
    const rows = page.locator(".home-row");
    await expect(rows).toHaveCount(5);
    await expect(rows.filter({ hasText: "Recepcionista IA" })).toHaveAttribute(
      "href",
      /\/es\/fabrica\?focus=recepcionista$/,
    );
    const soon = rows.filter({ hasText: "Experto Legal" });
    await expect(soon).toContainText("Próximamente");
    await expect(soon).not.toHaveAttribute("href");

    await page.getByRole("tab", { name: "Conductor" }).click();
    await expect(page.locator(".home-row")).toHaveCount(1);
    await expect(page.locator(".home-row")).toContainText("Copiloto");

    await page.getByRole("tab", { name: "Creador" }).click();
    await expect(page.locator(".home-row")).toContainText("Automatiza YouTube");

    // Tarjeta: los controles interactivos de la escena ocultos; overlay entra.
    await expect(page.locator(".home-scene-card .scene-stage")).toBeVisible();
    await expect(
      page.locator(".home-scene-card .scene-hotspot").first(),
    ).toBeHidden();
    const enter = page.locator(".home-enter");
    await expect(enter).toHaveAttribute("href", "/es/fabrica");
  });
});

test.describe("home escritorio (1440×900) — oficina animada", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("hero de siempre + escena interactiva; sin bloques de app", async ({
    page,
  }) => {
    await page.goto("/es");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Fábrica de IA",
    );
    await expect(page.locator(".home-hero-desktop")).toBeVisible();
    await expect(page.locator(".app-header")).toBeHidden();
    await expect(page.locator(".home-chips")).toBeHidden();
    await expect(page.locator(".home-scene-card .scene-stage")).toBeVisible();

    // En escritorio la escena del home ES interactiva: aros y Vista general.
    await expect(page.locator(".home-scene-card .scene-hotspot").first()).toBeVisible();
    await expect(
      page.locator(".home-scene-card .scene-overview"),
    ).toBeVisible();

    // El CTA primario vive en el header: "Crear empleado" → /crear.
    await expect(page.locator(".site-header .cta-button")).toHaveAttribute(
      "href",
      "/es/crear",
    );
    await expect(page.locator(".site-header .cta-button")).toContainText(
      "Crear empleado",
    );
  });
});
