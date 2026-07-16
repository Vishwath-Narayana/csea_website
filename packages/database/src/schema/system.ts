import { pgTable, text, timestamp, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./auth";

// ─── MEDIA ASSETS ───────────────────────────────────────────────────────────

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  publicId: text("public_id"), // Cloudinary public_id
  type: text("type").notNull(), // image, document, video
  fileName: text("file_name"),
  mimeType: text("mime_type"),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(), // e.g., 'CREATED_EVENT', 'UPDATED_PROJECT', 'DELETED_ARTICLE'
  entityType: text("entity_type").notNull(), // e.g., 'event', 'project', 'journal_post'
  entityId: text("entity_id").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
  entityTypeIdx: index("audit_logs_entity_type_idx").on(table.entityType),
  createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
}));

// ─── PLATFORM SETTINGS ─────────────────────────────────────────────────────
// Key-value store with JSONB values for flexible configuration.
// Security-sensitive secrets MUST remain in environment variables.

export const platformSettings = pgTable("platform_settings", {
  key: text("key").primaryKey().notNull(), // e.g., 'general', 'branding', 'maintenance'
  value: jsonb("value").notNull(), // JSON object for the settings group
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
});
