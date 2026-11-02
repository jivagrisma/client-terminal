import { expect, test } from "@playwright/test";

// Cambio de idioma (T9): la ruta actual se conserva y la elección queda en la
// cookie NEXT_LOCALE (LocaleSwitcher, R2 del plan T4). exact: true evita que
// "EN" coincida con "Engineer mode" (el match por nombre es substring).
test("ES → EN conserva la ruta y fija la cookie NEXT_LOCALE", async ({
  page,
}) => {
  await page.goto("/es/express");
  await expect(page).toHaveURL(/\/es\/express$/);

  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/express$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Run your AI factory",
  );

  const cookies = await page.context().cookies();
  const locale = cookies.find((cookie) => cookie.name === "NEXT_LOCALE");
  expect(locale?.value).toBe("en");
});

test("EN → ES conserva la ruta y vuelve al copy en español", async ({
  page,
  viewport,
}) => {
  await page.goto("/en");
  // En el home móvil el conmutador vive dentro del menú de la cabecera app (T8).
  if ((viewport?.width ?? 0) < 1024) {
    await page.locator(".app-avatar").click();
  }
  await page.getByRole("link", { name: "ES", exact: true }).click();
  await expect(page).toHaveURL(/\/es$/);
  // En móvil el h1 del home es la pregunta de la cabecera app (T8): el copy
  // en español se verifica con el subtítulo, presente en ambas variantes.
  await expect(page.locator(".home-subtitle")).toContainText(
    "Crea tu asistente en WhatsApp.",
  );

  const cookies = await page.context().cookies();
  const locale = cookies.find((cookie) => cookie.name === "NEXT_LOCALE");
  expect(locale?.value).toBe("es");
});

test("el idioma activo está marcado con aria-current", async ({ page }) => {
  await page.goto("/en/express");
  await expect(
    page.getByRole("link", { name: "EN", exact: true }),
  ).toHaveAttribute("aria-current", "true");
  await expect(
    page.getByRole("link", { name: "ES", exact: true }),
  ).not.toHaveAttribute("aria-current");
});
