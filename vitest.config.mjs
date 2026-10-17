import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/server/**/*.ts"],
    },
  },
  resolve: {
    alias: [
      { find: "@/server", replacement: path.resolve(import.meta.dirname, "./src/server") },
      { find: "@", replacement: path.resolve(import.meta.dirname, "./") },
    ],
  },
});
