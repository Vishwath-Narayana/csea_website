import { z } from "zod";

const eventBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  eventType: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  venue: z.string().max(200).optional(),
  format: z.enum(["OFFLINE", "ONLINE", "HYBRID"]).default("OFFLINE"),
  meetingUrl: z.string().url().optional().or(z.literal("")),

  registrationEnabled: z.boolean().default(false),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  registrationOpenAt: z.preprocess((val) => (val === "" || val === null ? undefined : val), z.coerce.date().optional()),
  registrationCloseAt: z.preprocess((val) => (val === "" || val === null ? undefined : val), z.coerce.date().optional()),

  facultyCoordinator: z.string().max(100).optional(),
  studentCoordinator: z.string().max(100).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(20).optional(),

  status: z.enum(["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
});

export const createEventSchema = eventBaseSchema.refine(
  (data) => data.endDate > data.startDate,
  { message: "End date must be after start date", path: ["endDate"] }
);

export const updateEventSchema = eventBaseSchema.partial().omit({ slug: true });

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
