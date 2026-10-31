import { defineConfig, devices } from "@playwright/test";

// Pruebas e2e contra el build de producción (ADR-0005): se asume `next build`
// previo; el webServer levanta `next start` en el puerto 3000 (regla del
// proyecto). Los dos proyectos replican los viewports del brief (§5.2 F):
// escritorio 1440×900 y móvil 390×844.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      // Emulación iPhone 13 (390×844) sobre Chromium: el descriptor trae
      // defaultBrowserType webkit, que aquí no instalamos (ADR-0005).
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
