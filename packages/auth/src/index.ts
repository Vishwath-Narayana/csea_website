import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@csea/database";
import * as schema from "@csea/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    generateId: () => crypto.randomUUID(),
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  trustedOrigins: [
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:5174", "http://127.0.0.1:5174",
    "http://localhost:5175", "http://127.0.0.1:5175",
    "http://localhost:4321", "http://127.0.0.1:4321"
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "EDITOR",
      },
      avatarUrl: {
        type: "string",
      }
    }
  },
  session: {
    modelName: "sessions",
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
});
