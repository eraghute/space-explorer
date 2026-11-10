import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vitest/config";
import cesiumPlugin from "vite-plugin-cesium";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // The package's NodeNext declaration types its ESM default as a namespace.
    // @ts-expect-error Its actual default export is the plugin factory.
    cesiumPlugin({ rebuildCesium: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
