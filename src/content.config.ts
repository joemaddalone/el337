import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const BLOG_PATH = "src/data/blog/";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.(md|mdx|astro)", base: `./${BLOG_PATH}` }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.date(),
			excerpt: z.string(),
			short: z.string().optional(),
			featured: z.boolean().optional(),
			draft: z.boolean().optional(),
			tags: z.array(z.string()).default(["others"]),
			ogImage: image().or(z.string()).optional(),
			description: z.string().optional(),
			canonicalURL: z.string().optional(),
			timezone: z.string().optional(),
		}),
});

export const collections = { blog };
