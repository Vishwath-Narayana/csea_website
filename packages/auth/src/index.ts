import { betterAuth } from "better-auth";
import { db } from "@csea/database";

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  // Session configuration, etc.
});
