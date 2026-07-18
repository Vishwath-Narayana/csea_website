import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200).regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),

  status: z.enum(["DRAFT", "RECRUITING", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  projectLead: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  techStack: z.array(z.string()).optional(),

  repositoryUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  applicationUrl: z.string().url().optional().or(z.literal("")),
});

export const updateProjectSchema = createProjectSchema.partial().omit({ slug: true });

export const createProjectRoleSchema = z.object({
  projectId: z.string().uuid(),
  roleName: z.string().min(1, "Role name is required").max(100),
  numberOfOpenings: z.number().int().min(1).default(1),
  requiredSkills: z.string().max(500).optional(),
  description: z.string().max(1000).optional(),
  eligibility: z.string().max(500).optional(),
});

export const updateProjectRoleSchema = createProjectRoleSchema.partial().omit({ projectId: true });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateProjectRoleInput = z.infer<typeof createProjectRoleSchema>;
export type UpdateProjectRoleInput = z.infer<typeof updateProjectRoleSchema>;
