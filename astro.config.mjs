import path from "node:path";
import url from "node:url";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import db from "@astrojs/db";
import node from "@astrojs/node";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const { COOLIFY_URL } = import.meta.env;

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  security: {
    checkOrigin: true,
  },
  site: import.meta.env.PROD ? COOLIFY_URL : "http://localhost:4321",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    db(),
  ],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  experimental: {
    env: {
      schema: {
        // GITHUB_CLIENT_ID: envField.string({
        //   context: "server",
        //   access: "secret",
        // }),
        // GITHUB_CLIENT_SECRET: envField.string({
        //   context: "server",
        //   access: "secret",
        // }),
        // GOOGLE_CLIENT_ID: envField.string({
        //   context: "server",
        //   access: "secret",
        // }),
        // GOOGLE_CLIENT_SECRET: envField.string({
        //   context: "server",
        //   access: "secret",
        // }),
      },
    },
  },
});
