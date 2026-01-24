import { defineConfig } from "cypress";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: BASE_URL,
    // do not clean state on each "it"!
    testIsolation: false,
  },
});
