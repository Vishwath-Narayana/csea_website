import { z } from "zod";

export const createJournalPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  authorId: z.string().uuid().optional(),
  category: z.string().max(50).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  publishedAt: z.preprocess((val) => (val === "" || val === null ? undefined : val), z.coerce.date().optional()),
});

export const updateJournalPostSchema = createJournalPostSchema.partial().omit({ slug: true });

export type CreateJournalPostInput = z.infer<typeof createJournalPostSchema>;
export type UpdateJournalPostInput = z.infer<typeof updateJournalPostSchema>;
