import { expect, test } from "@playwright/test";

// Navegación del header (T9). En móvil (<768px) la nav directa queda oculta
// (display:none: fuera del árbol de accesibilidad, así que los roles no la
// ven): esos recorridos se cubren con el test de menú.
test("el header muestra wordmark y navegación principal", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("link", { name: "Fábrica de IA" })).toBeVisible();
  await expect(page.locator(".site-nav")).toBeAttached();
  await expect(
    page.locator('.site-nav a[href$="/express"]'),
  ).toBeAttached();
  await expect(
    page.locator('.site-nav a[href^="/cv-jorge-grisales"]'),
  ).toBeAttached();
});

test("el wordmark lleva a Explorar y Modo express a /es/express", async ({
  page,
  viewport,
}) => {
  test.skip(
    (viewport?.width ?? 0) < 768,
    "en móvil la nav directa está oculta; se cubre con el test del menú",
  );
  await page.goto("/en");
  await page.getByRole("link", { name: "Express mode" }).click();
  await expect(page).toHaveURL(/\/en\/express$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Run your AI factory",
  );

  await page.getByRole("link", { name: "Fábrica de IA" }).click();
  await expect(page).toHaveURL(/\/en$/);
});

test("el CTA Comenzar lleva a /es/contacto", async ({ page }) => {
  await page.goto("/es");
  // Desktop: CTA del header; móvil: CTA de la barra inferior fija. El hero
  // también usa .cta-button pero lleva a /express — se excluye por contenedor.
  await page
    .locator(
      ".site-header .cta-button:visible, .mobile-cta-bar .cta-button:visible",
    )
    .first()
    .click();
  await expect(page).toHaveURL(/\/es\/contacto$/);
});

test("el skip-link salta al contenido", async ({ page }) => {
  await page.goto("/es");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
});

test("en móvil el menú abre, lista enlaces y cierra con Esc", async ({
  page,
  viewport,
}) => {
  test.skip(
    (viewport?.width ?? 0) >= 768,
    "el menú móvil solo se muestra bajo 768px",
  );
  await page.goto("/es");
  // El botón cambia su etiqueta al abrir/cerrar: locator estable por clase.
  const button = page.locator(".mobile-menu-button");
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const panel = page.locator("#mobile-menu-panel");
  await expect(panel).toBeVisible();
  await expect(
    panel.locator('a[href$="/express"]'),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
});
