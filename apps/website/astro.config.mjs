// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: "https://el337.com",
  output: "static",
  integrations: [expressiveCode(), mdx(), sitemap(), react()],
  markdown: {
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
    },
  },
  vite: {
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
    ],
  },
});
