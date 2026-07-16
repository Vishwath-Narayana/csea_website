import { auth } from "@csea/auth";
import { db } from "@csea/database";
import { users, accounts } from "@csea/database/src/schema/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
    
    // Create User via Drizzle directly
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({
      email,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      emailVerified: true,
    }).returning();
    
    // Create Account for credentials
    await db.insert(accounts).values({
      id: crypto.randomUUID(),
      userId: newUser.id,
      accountId: email,
      providerId: "credential",
      password: hashedPassword,
    });
    
    console.log(`Successfully bootstrapped Super Admin user ${email}`);
  } catch (error) {
    console.error("Failed to bootstrap Super Admin:", error);
  }
}
