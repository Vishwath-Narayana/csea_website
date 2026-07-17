import { auth } from "@csea/auth";
import { db } from "@csea/database";
import { users } from "@csea/database/src/schema/auth";
import { eq } from "drizzle-orm";

async function createTestUsers() {
  const roles = ["ADMIN", "EDITOR", "VIEWER"];
  for (const role of roles) {
    const email = `${role.toLowerCase()}@csea.kitsw.ac.in`;
    const password = "Password123";
    
    // check if user exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existing) {
      // Delete existing to start clean
      await db.delete(users).where(eq(users.id, existing.id));
      console.log(`Cleaned up existing user ${email}`);
    }
    
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${role} User`,
      }
    });
    
    if (res && res.user) {
      await db.update(users).set({ role, emailVerified: true }).where(eq(users.id, res.user.id));
      console.log(`Created test user: ${email} with role: ${role}`);
    }
  }
}

createTestUsers()
  .then(() => {
    console.log("All test users created successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error creating test users:", err);
    process.exit(1);
  });
