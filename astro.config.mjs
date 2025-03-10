import path from "node:path";
import url from "node:url";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import node from "@astrojs/node";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  security: {
    checkOrigin: true,
  },
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  vite: {
    plugins: [
      TanStackRouterVite({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/app/routeTree.gen.ts",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  output: "server",
  adapter: node({ mode: "standalone" }),
});
