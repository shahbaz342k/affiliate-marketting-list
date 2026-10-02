import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts, sessions, users, verifications } from "@/db/schema";
import { sendAccountEmail } from "@/lib/email";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const developmentOrigins =
  process.env.NODE_ENV === "development"
    ? [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ]
    : [];

export const userAuth = betterAuth({
  appName: "Product Picks",
  baseURL,
  trustedOrigins: [baseURL, ...developmentOrigins],
  secret:
    process.env.AUTH_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    (process.env.NODE_ENV === "production" ? undefined : "local-dev-secret-change-before-deploy-32-chars"),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAccountEmail({ to: user.email, subject: "Reset your password", url });
    },
  },
  user: {
    additionalFields: {
      approved: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
        returned: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const [user] = await db
            .select({ approved: users.approved })
            .from(users)
            .where(eq(users.id, session.userId))
            .limit(1);
          if (!user?.approved) {
            throw new APIError("FORBIDDEN", { message: "Your account is awaiting admin approval." });
          }
          return { data: session };
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies()],
});