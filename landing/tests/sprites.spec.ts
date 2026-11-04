import { expect, test } from "@playwright/test";

// T7 (ADR-0004/0009): estados del chat → sprites con la capa AÚN sin assets
// (los sheets del dueño siguen pendientes). Con sprites.json deshabilitado la
// escena debe quedar IDÉNTICA: capa desmontada, 0 sprites, y la conversación
// funcionando sin errores (el latido nivel-1 cubre el feedback del chat).

test.describe("capa de sprites con stateSheets sin assets (T7)", () => {
  test("la capa sigue desmontada y sin sprites en la escena", async ({ page }) => {
    await page.goto("/es/fabrica");
    await expect(page.locator('.scene-layer[data-layer="sprites"]')).toHaveAttribute(
      "data-enabled",
      "false",
    );
    await expect(page.locator(".scene-sprite")).toHaveCount(0);
  });

  test("abrir una conversación no monta sprites ni rompe el chat", async ({ page }) => {
    await page.goto("/es/fabrica?chat=recepcionista");
    const panel = page.getByRole("dialog", { name: "Recepcionista IA" });
    await expect(panel).toBeVisible();
    await page.locator(".chat-chip").first().dispatchEvent("click");
    await expect(page.locator(".chat-typing")).toHaveCount(0);
    await expect(page.locator(".scene-sprite")).toHaveCount(0);
    await expect(page.locator('.scene-layer[data-layer="sprites"]')).toHaveAttribute(
      "data-enabled",
      "false",
    );
  });
});
