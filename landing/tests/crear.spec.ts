import { expect, test } from "@playwright/test";

// /crear (T9, ADR-0008, R10): placeholder honesto con camino de contacto
// funcional. Sin NEXT_PUBLIC_WA_NUMBER el "Avísame" lleva a /contacto.
test.describe("/es/crear", () => {
  test("placeholder honesto: sin promesas y con contacto funcional", async ({
    page,
  }) => {
    await page.goto("/es/crear");
    await expect(
      page.getByRole("heading", { name: "Crea tu empleado de IA" }),
    ).toBeVisible();
    // No promete creación real: dice "Vista previa".
    await expect(page.locator(".placeholder-page")).toContainText(
      "Vista previa",
    );
    await expect(page.locator(".placeholder-page")).toContainText(
      "TODO_CONTENT",
    );

    // Sin env var → contacto interno.
    const notify = page.locator(".placeholder-page .cta-button");
    await expect(notify).toHaveAttribute("href", "/es/contacto");
  });

  test("sitemap y hreflang anuncian /crear", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    expect(body).toContain("/es/crear");
    expect(body).toContain("/en/crear");
  });
});
