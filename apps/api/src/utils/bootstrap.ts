// Trigger watcher reload
import { auth } from "@csea/auth";
import { db } from "@csea/database";
import { users } from "@csea/database/src/schema/auth";
import { eq } from "drizzle-orm";

export async function bootstrapAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("No SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD provided. Skipping bootstrap.");
    return;
  }

  try {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      console.log(`Super Admin user ${email} already exists.`);
      // Ensure the role is SUPER_ADMIN
      if (existingUser.role !== "SUPER_ADMIN") {
        await db.update(users).set({ role: "SUPER_ADMIN" }).where(eq(users.id, existingUser.id));
        console.log(`Updated role to SUPER_ADMIN for ${email}.`);
      }
      return;
    }

    console.log(`Bootstrapping Super Admin user ${email}...`);
    
    // Create User via Better Auth API directly to ensure password is hashed correctly
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Super Admin",
      },
    });

    if (result && result.user) {
      // Promote to SUPER_ADMIN and set emailVerified to true
      await db.update(users)
        .set({ role: "SUPER_ADMIN", emailVerified: true })
        .where(eq(users.id, result.user.id));
      
      console.log(`Successfully bootstrapped Super Admin user ${email}`);
    } else {
      console.error("Failed to bootstrap: no user returned from signUpEmail.");
    }
  } catch (error) {
    console.error("Failed to bootstrap Super Admin:", error);
  }
}
