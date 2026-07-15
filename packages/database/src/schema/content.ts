import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const journalPosts = pgTable("journal_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: text("cover_image"),
  authorId: uuid("author_id").references(() => users.id),
  status: text("status").notNull().default("DRAFT"), // DRAFT, IN_REVIEW, PUBLISHED, ARCHIVED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
  archivedAt: timestamp("archived_at"),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  coverImage: text("cover_image"),
  description: text("description"),
  venue: text("venue"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("DRAFT"),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("REGISTERED"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  coverImage: text("cover_image"),
  description: text("description"),
  problemStatement: text("problem_statement"),
  technologies: text("technologies").array(),
  mentorId: uuid("mentor_id").references(() => users.id),
  status: text("status").notNull().default("OPEN"), // OPEN, ACTIVE, COMPLETED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectApplications = pgTable("project_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  details: text("details"),
  status: text("status").notNull().default("PENDING"), // PENDING, SHORTLISTED, SELECTED, REJECTED
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleries = pgTable("galleries", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  eventId: uuid("event_id").references(() => events.id),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
