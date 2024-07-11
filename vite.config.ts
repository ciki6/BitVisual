import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: "dist",
    target: "esnext",
    minify: "esbuild",
    copyPublicDir: true,
    rollupOptions: {
      external: ["d3", "jquery", "lodash"],
      output: {
        globals: {
          d3: "d3",
          $: "jquery",
          _: "lodash",
        },
      },
    },
    lib: {
      entry: "./lib/index.ts",
      name: "WisChart",
      fileName: "index",
    },
  },
  plugins: [dts({ include: ["lib"] }), vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    open: "/index.html",
  },
});
