// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	site: 'https://el337.com',
	integrations: [mdx(), sitemap(), react()],
	markdown: {
		shikiConfig: {
			themes: { light: "min-light", dark: "night-owl" },
			defaultColor: false,
			wrap: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
