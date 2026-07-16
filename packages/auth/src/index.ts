import { betterAuth } from "better-auth";
import { db } from "@csea/database";

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "users",
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
