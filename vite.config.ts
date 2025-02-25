import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: "dist",
    target: "esnext",
    minify: "esbuild",
    copyPublicDir: true,
    rollupOptions: {
      // external: ["d3", "jquery", "lodash"],
      external: [],
      output: {
        format: "es",
        inlineDynamicImports: false,
        globals: {
          d3: "d3",
          $: "jquery",
          _: "lodash",
        },
        entryFileNames: "index.js", // 入口文件打包为 index.js
        chunkFileNames: "chunks/[name].js", // 其他文件（如动态导入的文件）打包到 chunks 目录
        assetFileNames: "assets/[name].[ext]",
        // 配置 code splitting
        manualChunks(id) {
          if (id.includes("lib/")) {
            const parts = id.split("/");
            const name = parts[parts.length - 1].replace(".ts", "");
            return `${name}`;
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
      // input: "./lib/index.ts", // 只有一个入口文件
    },
    lib: {
      entry: "./lib/index.ts",
      formats: ["es"],
      name: "WisChart",
      fileName: "index",
    },
  },
  plugins: [
    dts({
      entryRoot: "lib",
      outDir: "dist/@types",
      staticImport: true,
      insertTypesEntry: true,
      include: ["./lib/**/*", "./lib/types/**/*"],
      tsconfigPath: "./tsconfig.app.json",
      copyDtsFiles: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    open: "/",
    proxy: {
      "/ftp": {
        target: "http://172.19.136.133:6818/ftp",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ftp/, ""),
      },
    },
  },
});
