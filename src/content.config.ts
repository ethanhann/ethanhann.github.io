import {defineCollection} from "astro:content";
import {z} from "astro/zod";
import {glob} from "astro/loaders";

const projects = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/projects"}),
    schema: z.object({
        name: z.string(),
        url: z.url(),
        kind: z.enum(["backend", "frontend"]),
        description: z.string(),
        tags: z.array(z.string()).optional(),
        links: z
            .array(z.object({label: z.string(), url: z.url()}))
            .optional(),
        order: z.number().optional(),
    }),
});

const blog = defineCollection({
    loader: glob({pattern: "**/*.{md,mdx}", base: "./src/content/blog"}),
    schema: ({image}) =>
        z.object({
            title: z.string(),
            date: z.coerce.date(),
            description: z.string().optional(),
            ogImage: image().optional(),
            ogImageAlt: z.string().optional(),
        }),
});

const books = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/books"}),
    schema: z.object({
        title: z.string(),
        author: z.string(),
        status: z.enum(["reading", "finished", "want"]),
    }),
});

export const collections = {projects, blog, books};
