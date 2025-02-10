import react from "@astrojs/react";
import db from "@astrojs/db";
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  security: {
    checkOrigin: true,
  },
  integrations: [tailwind({ applyBaseStyles: false }), react(), db()],
  output: "server",
  site: import.meta.env.COOLIFY_FQDN ?? "http://localhost:4321",
});

// experimental: {
//   env: {
//     schema: {
//       // GITHUB_CLIENT_ID: envField.string({
//       //   context: "server",
//       //   access: "secret",
//       // }),
//       // GITHUB_CLIENT_SECRET: envField.string({
//       //   context: "server",
//       //   access: "secret",
//       // }),
//       // GOOGLE_CLIENT_ID: envField.string({
//       //   context: "server",
//       //   access: "secret",
//       // }),
//       // GOOGLE_CLIENT_SECRET: envField.string({
//       //   context: "server",
//       //   access: "secret",
//       // }),
//     },
//   },
// },
