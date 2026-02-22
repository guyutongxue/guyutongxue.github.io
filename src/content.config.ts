import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/contents/blog" }),
  schema: z.object({
    title: z.string(),
    updated_at: z.date(),
  })
});

export const collections = { blog };
