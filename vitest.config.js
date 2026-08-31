import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      thresholds: {
        lines: 10,
        functions: 10,
        statements: 10,
        branches: 5,
      },
    },
  },
});
