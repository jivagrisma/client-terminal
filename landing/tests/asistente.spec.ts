import { expect, test } from "@playwright/test";

// Fichas estáticas /asistente/[id] (ADR-0009, T5, brief §10): SSG 13×2,
// metadata/hreflang/canonical, JSON-LD Person|Service, puente a viajemos.co
// solo con caso real y 404 limpio para ids fuera del registro.

test.describe("/asistente/[id] · fichas estáticas (T5)", () => {
  test("recepcionista ES: ficha completa con chips, chat y puente a producción", async ({
    page,
  }) => {
    const res = await page.goto("/es/asistente/recepcionista");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Recepcionista IA");
    await expect(page).toHaveTitle(/Recepcionista IA — asistente de IA/);

    const grupos = page.locator(".asistente-chip-group");
    await expect(grupos).toHaveCount(2);
    await expect(grupos.first().locator("li").first()).toContainText(
      "¿Qué haces por un hotel?",
    );
    await expect(grupos.last().locator("li").first()).toContainText("por dentro");

    const abrir = page.getByRole("link", { name: "Abrir conversación en la fábrica" });
    await expect(abrir).toHaveAttribute("href", "/es/fabrica?chat=recepcionista");

    const puente = page.getByRole("link", { name: /Verlo en producción/ });
    await expect(puente).toHaveAttribute("href", /viajemos\.co\/\?utm_source=fabrica-ia/);
    await expect(puente).toHaveAttribute("rel", /noopener/);

    await expect(page.getByRole("link", { name: "Hablar con Jorge" })).toBeVisible();
  });

  test("recepcionista ES: JSON-LD Person, canonical y hreflang", async ({ page }) => {
    await page.goto("/es/asistente/recepcionista");
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toContain('"@type":"Person"');
    expect(ld).toContain('"name":"Recepcionista IA"');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/es\/asistente\/recepcionista$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en\/asistente\/recepcionista$/,
    );
  });

  test("recepcionista EN: ficha bilingüe", async ({ page }) => {
    await page.goto("/en/asistente/recepcionista");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Front Desk AI");
    await expect(page).toHaveTitle(/Front Desk AI — AI assistant/);
    await expect(
      page.getByRole("link", { name: "Open the conversation in the factory" }),
    ).toHaveAttribute("href", "/en/fabrica?chat=recepcionista");
  });

  test("mesa: chips y chat; JSON-LD Service (objeto del sistema)", async ({ page }) => {
    await page.goto("/es/asistente/mesa");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mesa central");
    await expect(page.getByRole("link", { name: "Abrir conversación en la fábrica" })).toHaveAttribute(
      "href",
      "/es/fabrica?chat=mesa",
    );
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toContain('"@type":"Service"');
    await expect(page.locator(".asistente-badge")).toHaveCount(0);
  });

  test("legal-experto: Próximamente sin chips ni chat", async ({ page }) => {
    await page.goto("/es/asistente/legal-experto");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Experto Legal");
    await expect(page.locator(".asistente-badge")).toHaveText("Próximamente");
    await expect(page.locator(".asistente-chips")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Hablar con Jorge" })).toBeVisible();
  });

  test("youtube-automatiza: ficha de la clase con chips; el chat se conecta en T6", async ({
    page,
  }) => {
    await page.goto("/es/asistente/youtube-automatiza");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Automatiza YouTube");
    await expect(page.locator(".asistente-badge")).toHaveText("Próximamente");
    await expect(page.locator(".asistente-chip-group")).toHaveCount(2);
    await expect(
      page.getByRole("link", { name: "Abrir conversación en la fábrica" }),
    ).toHaveCount(0);
  });

  test("id inválido responde 404 limpio (dynamicParams=false)", async ({ page }) => {
    const res = await page.goto("/es/asistente/inexistente");
    expect(res?.status()).toBe(404);
  });

  test("el sitemap anuncia las 26 fichas con hreflang", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("/es/asistente/recepcionista</loc>");
    expect(body).toContain("/en/asistente/youtube-automatiza</loc>");
    expect(body.match(/asistente\//g)?.length).toBeGreaterThanOrEqual(26);
    expect(body).toContain('hreflang="x-default"');
  });
});
