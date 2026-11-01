import { defineConfig } from "vitest/config";

// Solo unitarias (*.test.ts): los *.spec.ts de tests/ son e2e de Playwright
// (ADR-0005) y corren con otro runner. Nodo basta: las utilidades de cámara
// son puras y no tocan el DOM.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
