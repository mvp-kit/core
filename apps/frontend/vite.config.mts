import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { createClientConfig } from "../../packages/config/src/index.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const config = createClientConfig(env);

  return {
    plugins: [
      tanstackRouter({ target: "react" }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@config": path.resolve(__dirname, "../../packages/config"),
        "@types": path.resolve(__dirname, "../../packages/types"),
        "@utils": path.resolve(__dirname, "../../packages/utils"),
      },
    },
    server: {
      port: config.frontendPort,
      allowedHosts: config.allowedHosts,
      proxy: {
        "/api": { target: config.apiUrl, secure: false },
      },
      // Note: Use 'wrangler pages dev dist' for production-like testing
      // This tests the actual Cloudflare Pages Function (/functions/api/[[path]].js)
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      minify: "terser",
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
      chunkSizeWarningLimit: 600,
    },
  };
});
