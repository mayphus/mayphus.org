import { defineCollection, z } from 'astro:content';

const org = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		filetags: z.array(z.string()).optional(),
		description: z.string().optional(),
	}),
});

export const collections = { org };
