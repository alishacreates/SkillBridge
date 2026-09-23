import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["components/ui/**/*.test.tsx"],
    restoreMocks: true,
  },
});
