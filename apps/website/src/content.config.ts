import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

export const BLOG_PATH = "src/data/blog/";
export const COURSES_PATH = "src/data/courses/";

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
      coverImage: image().or(z.string()).optional(),
      coverImageInPost: z.boolean().optional().default(true),
      description: z.string().optional(),
      canonicalURL: z.string().optional(),
      timezone: z.string().optional(),
    }),
});

const courses = defineCollection({
  loader: glob({ pattern: "**/*.(md|mdx)", base: `./${COURSES_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      excerpt: z.string(),
      short: z.string().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      coverImage: image().or(z.string()).optional(),
      coverImageInPost: z.boolean().optional().default(true),
      description: z.string().optional(),
      canonicalURL: z.string().optional(),
      timezone: z.string().optional(),
      courseOrder: z.number().optional(),
    }),
});

/** One JSON file per course: src/data/courses/[slug]/_course.json */
const courseMeta = defineCollection({
  loader: glob({ pattern: "**/_course.json", base: `./${COURSES_PATH}` }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { blog, courses, courseMeta };
