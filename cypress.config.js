import { defineConfig } from "cypress";
import { startEnvironment } from "./cypress/support/environment.js";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 900,
  video: false,
  screenshotOnRunFailure: true,
  retries: 0,
  env: {
    apiUrl: process.env.CYPRESS_API_URL || "http://127.0.0.1:3000",
    healthMs: 500, productsMs: 1000, loginMs: 2000,
    profileMs: 1000, cartMs: 1000, checkoutMs: 3000,
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://127.0.0.1:5173",
    specPattern: "cypress/e2e/**/*.cy.js",
    async setupNodeEvents(on, config) {
      // Cypress 16: somente configuração pública é exposta ao navegador.
      config.expose = Object.fromEntries(["apiUrl", "healthMs", "productsMs", "loginMs", "profileMs", "cartMs", "checkoutMs"].map((key) => [key, config.env[key]]));
      await startEnvironment(on, config);
      return config;
    },
  },
});
