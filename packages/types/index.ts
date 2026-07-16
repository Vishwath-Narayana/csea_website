// ─── USER ROLES ─────────────────────────────────────────────────────────────

export const USER_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ─── EVENT ──────────────────────────────────────────────────────────────────

export const EVENT_STATUSES = ["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_VISIBILITIES = ["PUBLIC", "PRIVATE"] as const;
export type EventVisibility = (typeof EVENT_VISIBILITIES)[number];

export const EVENT_FORMATS = ["OFFLINE", "ONLINE", "HYBRID"] as const;
export type EventFormat = (typeof EVENT_FORMATS)[number];

export interface Event {
  id: string;
  title: string;
  slug: string;
  eventType: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  coverImage: string | null;
  startDate: Date;
  endDate: Date;
  venue: string | null;
  format: string | null;
  meetingUrl: string | null;
  registrationEnabled: boolean;
  registrationUrl: string | null;
  registrationOpenAt: Date | null;
  registrationCloseAt: Date | null;
  facultyCoordinator: string | null;
  studentCoordinator: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: string;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── PROJECT ────────────────────────────────────────────────────────────────

export const PROJECT_STATUSES = ["DRAFT", "RECRUITING", "ACTIVE", "COMPLETED", "ARCHIVED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  coverImage: string | null;
  status: string;
  projectLead: string | null;
  timeline: string | null;
  techStack: string[] | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── PROJECT ROLE ───────────────────────────────────────────────────────────

export interface ProjectRole {
  id: string;
  projectId: string;
  roleName: string;
  numberOfOpenings: number;
  requiredSkills: string | null;
  description: string | null;
  eligibility: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── PROJECT APPLICATION ────────────────────────────────────────────────────

export const APPLICATION_STATUSES = ["PENDING", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface ProjectApplication {
  id: string;
  projectId: string;
  projectRoleId: string | null;
  applicantName: string;
  email: string;
  phone: string | null;
  rollNumber: string | null;
  year: string | null;
  statement: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  resumeUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── JOURNAL POST ───────────────────────────────────────────────────────────

export const JOURNAL_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type JournalStatus = (typeof JOURNAL_STATUSES)[number];

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  authorId: string | null;
  category: string | null;
  status: string;
  visibility: string;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── GALLERY ────────────────────────────────────────────────────────────────

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  relatedEventId: string | null;
  eventDate: Date | null;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── GALLERY PHOTO ──────────────────────────────────────────────────────────

export interface GalleryPhoto {
  id: string;
  galleryId: string;
  url: string;
  publicId: string | null;
  fileName: string;
  mimeType: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: Date;
}

// ─── AUDIT LOG ──────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  description: string | null;
  metadata: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

// ─── PLATFORM SETTINGS ─────────────────────────────────────────────────────

export interface PlatformSetting {
  key: string;
  value: unknown;
  updatedAt: Date;
  updatedBy: string | null;
}

// ─── VISIBILITY ─────────────────────────────────────────────────────────────

export const VISIBILITIES = ["PUBLIC", "PRIVATE"] as const;
export type Visibility = (typeof VISIBILITIES)[number];
