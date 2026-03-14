// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
		plugins: [
			tailwindcss(),
			viteStaticCopy({
				targets: [
					{
						src: 'src/pages/garkbit/**/*.jpg',
						dest: '.',
						rename: (name, extension, fullPath) => {
							const match = fullPath.match(/src[\/\\]pages[\/\\](.*)$/);
							if (match) return match[1];
							return `${name}.${extension}`;
						}
					}
				]
			})
		],
	},
});
