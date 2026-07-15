import { db } from "./index";
import { users, roles, permissions, rolePermissions, journalPosts, events, projects, galleries } from "./schema";

async function seed() {
  console.log("Seeding database...");
  
  try {
    // Basic setup for RBAC
    const [adminRole] = await db.insert(roles).values({ name: "ADMIN", description: "Administrator" }).returning();
    const [editorRole] = await db.insert(roles).values({ name: "EDITOR", description: "Content Editor" }).returning();
    
    // Seed Users
    const [adminUser] = await db.insert(users).values({
      name: "CSEA Admin",
      email: "admin@csea.kitsw.ac.in",
      role: "ADMIN"
    }).returning();
    
    const [workUser] = await db.insert(users).values({
      name: "CSEA Joint Exec",
      email: "editor@csea.kitsw.ac.in",
      role: "EDITOR"
    }).returning();

    // Seed Journal
    await db.insert(journalPosts).values({
      title: "Welcome to the new CSEA Platform",
      slug: "welcome",
      excerpt: "A new beginning for our community.",
      content: "We are excited to launch the new CSEA platform. Here you will find all updates, projects, and events.",
      authorId: adminUser.id,
      status: "PUBLISHED",
      publishedAt: new Date()
    });

    // Seed Events
    const [event1] = await db.insert(events).values({
      title: "Orientation 2026",
      slug: "orientation-2026",
      description: "Welcome event for the new batch.",
      venue: "Main Auditorium",
      startDate: new Date(new Date().setHours(new Date().getHours() + 24)),
      endDate: new Date(new Date().setHours(new Date().getHours() + 28)),
      status: "PUBLISHED",
      capacity: 200
    }).returning();

    // Seed Projects
    await db.insert(projects).values({
      title: "CSEA Website Reboot",
      slug: "csea-website",
      description: "Building the new digital platform for CSEA.",
      problemStatement: "The old website is static and hard to maintain.",
      technologies: ["Astro", "React", "Fastify", "PostgreSQL"],
      mentorId: adminUser.id,
      status: "ACTIVE"
    });

    console.log("Seed completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
