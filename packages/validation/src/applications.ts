import { z } from "zod";

export const createProjectApplicationSchema = z.object({
  projectId: z.string().uuid(),
  projectRoleId: z.string().uuid().optional(),
  applicantName: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().max(20).optional(),
  rollNumber: z.string().max(20).optional(),
  year: z.string().max(10).optional(),
  statement: z.string().max(2000).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
});

export const updateProjectApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"]),
});

export type CreateProjectApplicationInput = z.infer<typeof createProjectApplicationSchema>;
export type UpdateProjectApplicationStatusInput = z.infer<typeof updateProjectApplicationStatusSchema>;
