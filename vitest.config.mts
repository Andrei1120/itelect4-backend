import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Use Node environment (no DOM needed for the backend)
    environment: "node",
    // vitest needs to handle .ts files directly — tsx handles that
    // but we need globals off so explicit imports are used (matches tsconfig)
    globals: false,
  },
});
