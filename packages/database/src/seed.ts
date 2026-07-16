import { db } from "./index";
import {
  users, roles, permissions, rolePermissions,
  journalPosts, events, projects, projectRoles, galleries,
  platformSettings,
} from "./schema";

async function seed() {
  console.log("Seeding database...");
  
  try {
    // ── RBAC Setup ──────────────────────────────────────────────────────
    const [adminRole] = await db.insert(roles).values({ name: "SUPER_ADMIN", description: "Full system access" }).returning();
    const [editorRole] = await db.insert(roles).values({ name: "EDITOR", description: "Content editor" }).returning();
    
    // ── Users ───────────────────────────────────────────────────────────
    const [adminUser] = await db.insert(users).values({
      name: "CSEA Admin",
      email: "admin@csea.kitsw.ac.in",
      role: "SUPER_ADMIN"
    }).returning();
    
    const [editorUser] = await db.insert(users).values({
      name: "CSEA Joint Exec",
      email: "editor@csea.kitsw.ac.in",
      role: "EDITOR"
    }).returning();

    // ── Journal ─────────────────────────────────────────────────────────
    await db.insert(journalPosts).values({
      title: "Welcome to the new CSEA Platform",
      slug: "welcome",
      excerpt: "A new beginning for our community.",
      content: "We are excited to launch the new CSEA platform. Here you will find all updates, projects, and events.",
      authorId: adminUser.id,
      category: "Announcements",
      status: "PUBLISHED",
      visibility: "PUBLIC",
      publishedAt: new Date(),
    });

    // ── Events ──────────────────────────────────────────────────────────
    await db.insert(events).values({
      title: "CSEA Orientation 2026",
      slug: "orientation-2026",
      eventType: "Orientation",
      shortDescription: "Welcome event for the new batch.",
      fullDescription: "Join us to discover how the association operates, the projects we are launching, and how you can become a core contributor.",
      venue: "Main Auditorium",
      format: "OFFLINE",
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 28 * 60 * 60 * 1000),
      registrationEnabled: true,
      registrationUrl: "https://forms.google.com/csea-orientation-2026",
      registrationOpenAt: new Date(),
      registrationCloseAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
      facultyCoordinator: "Dr. Rao",
      studentCoordinator: "Vishwath N.",
      contactEmail: "orientation@csea.kitsw.ac.in",
      status: "PUBLISHED",
      visibility: "PUBLIC",
    });

    // ── Projects ────────────────────────────────────────────────────────
    const [project1] = await db.insert(projects).values({
      title: "CSEA Digital Platform",
      slug: "csea-platform",
      shortDescription: "Building the new digital platform for CSEA.",
      fullDescription: "The core digital backbone for the association featuring a public Astro web engine, custom administrative console, Fastify REST APIs, and PostgreSQL.",
      status: "RECRUITING",
      projectLead: "Vishwath N.",
      timeline: "Fall 2026",
      techStack: ["Astro", "React", "Fastify", "PostgreSQL"],
      repositoryUrl: "https://github.com/Vishwath-Narayana/csea_website",
    }).returning();

    // ── Project Roles ───────────────────────────────────────────────────
    await db.insert(projectRoles).values([
      {
        projectId: project1.id,
        roleName: "Frontend Developer",
        numberOfOpenings: 3,
        requiredSkills: "React, Tailwind CSS, TypeScript",
        description: "Build and maintain the admin dashboard and public website components.",
      },
      {
        projectId: project1.id,
        roleName: "Backend Developer",
        numberOfOpenings: 1,
        requiredSkills: "Node.js, Fastify, PostgreSQL, Drizzle ORM",
        description: "Develop REST API endpoints and database integrations.",
      },
    ]);

    // ── Platform Settings ───────────────────────────────────────────────
    await db.insert(platformSettings).values([
      {
        key: "general",
        value: {
          platformName: "CSEA Digital Platform",
          supportEmail: "support@csea.kitsw.ac.in",
          metaDescription: "The official platform for Computer Science & Engineering Association, KITSW.",
        },
      },
      {
        key: "maintenance",
        value: {
          enabled: false,
          message: "The platform is currently under maintenance. Please check back later.",
        },
      },
    ]);

    console.log("Seed completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
