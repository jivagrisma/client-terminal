import { expect, test } from "@playwright/test";

// Modo express (T9, brief §9): las 9 secciones visibles, sin overflow
// horizontal, en desktop (1440×900) y móvil (390×844) — los dos proyectos del
// playwright.config. La escena es solo miniatura: nunca carga .scene-stage
// (§5.2 D).
const SECTIONS = [
  "get-started",
  "problem",
  "how-it-works",
  "team",
  "production",
  "architecture",
  "about",
  "faq",
  "contact",
] as const;

test("las 9 secciones del §9 existen y son visibles", async ({ page }) => {
  await page.goto("/es/express");
  for (const id of SECTIONS) {
    await expect(page.locator(`section#${id}`)).toBeVisible();
  }
  await expect(page.locator(".team-card")).toHaveCount(9);
});

test("sin overflow horizontal y con CTA final a /contacto", async ({
  page,
}) => {
  await page.goto("/es/express");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dirige tu fábrica de IA",
  );
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  await expect(
    page.locator("section#contact").getByRole("link", { name: "Comenzar" }),
  ).toHaveAttribute("href", "/es/contacto");
});

test("la escena es miniatura, no la escena por capas (§5.2 D)", async ({
  page,
}) => {
  await page.goto("/en/express");
  await expect(page.locator(".scene-stage")).toHaveCount(0);
  const thumb = page.locator(".express-thumb img");
  await expect(thumb).toBeVisible();
  await expect(thumb).toHaveAttribute("src", /scene-day\.jpg/);
});

test("los datos pendientes del dueño quedan como TODO_CONTENT visibles", async ({
  page,
}) => {
  await page.goto("/es/express");
  const body = await page.locator("body").innerText();
  expect(body).toContain("TODO_CONTENT");
});

test("el FAQ colapsa y expande sin JS propio", async ({ page }) => {
  await page.goto("/es/express");
  const first = page.locator("details.faq-item").first();
  await expect(first.locator("summary")).toBeVisible();
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open");
});
