import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  use: {
    channel: "chrome",
    baseURL: "http://127.0.0.1:5180",
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 5180 --strictPort",
    url: "http://127.0.0.1:5180",
    reuseExistingServer: false,
  },
});
