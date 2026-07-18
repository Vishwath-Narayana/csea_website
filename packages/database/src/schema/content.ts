import { pgTable, text, timestamp, uuid, integer, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./auth";

// ─── JOURNAL POSTS ──────────────────────────────────────────────────────────

export const journalPosts = pgTable("journal_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"), // Markdown or sanitized HTML
  coverImage: text("cover_image"),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  category: text("category"), // e.g., Technical, Announcements, Reports, Community
  status: text("status").notNull().default("DRAFT"), // DRAFT, PUBLISHED, ARCHIVED
  visibility: text("visibility").notNull().default("PUBLIC"), // PUBLIC, PRIVATE
  publishedAt: timestamp("published_at"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("journal_posts_slug_idx").on(table.slug),
  statusIdx: index("journal_posts_status_idx").on(table.status),
  publishedAtIdx: index("journal_posts_published_at_idx").on(table.publishedAt),
}));

// ─── EVENTS ─────────────────────────────────────────────────────────────────
// Event registration is handled externally via Google Forms or similar.
// The platform only stores the external registration URL and availability.
// There is NO internal event_registrations table.

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  eventType: text("event_type"), // e.g., Workshop, Hackathon, Talk, Orientation, Seminar
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  coverImage: text("cover_image"),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  venue: text("venue"),
  format: text("format").default("OFFLINE"), // OFFLINE, ONLINE, HYBRID
  meetingUrl: text("meeting_url"),

  // External registration
  registrationEnabled: boolean("registration_enabled").default(false).notNull(),
  registrationUrl: text("registration_url"),
  registrationOpenAt: timestamp("registration_open_at"),
  registrationCloseAt: timestamp("registration_close_at"),

  // Coordination
  facultyCoordinator: text("faculty_coordinator"),
  studentCoordinator: text("student_coordinator"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),

  status: text("status").notNull().default("DRAFT"), // DRAFT, PUBLISHED, COMPLETED, CANCELLED
  visibility: text("visibility").notNull().default("PUBLIC"), // PUBLIC, PRIVATE

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("events_slug_idx").on(table.slug),
  statusIdx: index("events_status_idx").on(table.status),
  startDateIdx: index("events_start_date_idx").on(table.startDate),
}));

// ─── PROJECTS ───────────────────────────────────────────────────────────────

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  coverImage: text("cover_image"),

  status: text("status").notNull().default("DRAFT"), // DRAFT, RECRUITING, ACTIVE, COMPLETED, ARCHIVED
  visibility: text("visibility").notNull().default("PUBLIC"), // PUBLIC, PRIVATE
  projectLead: text("project_lead"),
  timeline: text("timeline"),
  techStack: text("tech_stack").array(),

  repositoryUrl: text("repository_url"),
  demoUrl: text("demo_url"),
  applicationUrl: text("application_url"), // External Google Form or similar for project applications

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("projects_slug_idx").on(table.slug),
  statusIdx: index("projects_status_idx").on(table.status),
}));

// ─── PROJECT ROLES ──────────────────────────────────────────────────────────

export const projectRoles = pgTable("project_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  roleName: text("role_name").notNull(),
  numberOfOpenings: integer("number_of_openings").default(1).notNull(),
  requiredSkills: text("required_skills"),
  description: text("description"),
  eligibility: text("eligibility"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  projectIdIdx: index("project_roles_project_id_idx").on(table.projectId),
}));


// ─── GALLERIES ──────────────────────────────────────────────────────────────

export const galleries = pgTable("galleries", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  relatedEventId: uuid("related_event_id").references(() => events.id, { onDelete: "set null" }),
  eventDate: timestamp("event_date"),
  visibility: text("visibility").notNull().default("PUBLIC"), // PUBLIC, PRIVATE
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("galleries_slug_idx").on(table.slug),
}));

// ─── GALLERY PHOTOS ─────────────────────────────────────────────────────────
// Designed for cloud media storage (Cloudinary). publicId stores the
// Cloudinary public_id for transformations and deletions.

export const galleryPhotos = pgTable("gallery_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  galleryId: uuid("gallery_id").references(() => galleries.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  publicId: text("public_id"), // Cloudinary public_id
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type"),
  fileSize: integer("file_size"), // bytes
  width: integer("width"),
  height: integer("height"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  galleryIdIdx: index("gallery_photos_gallery_id_idx").on(table.galleryId),
}));
