// @ts-nocheck
import fp from "fastify-plugin";
import { auth } from "@csea/auth";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { toNodeHandler } from "better-auth/node";

declare module "fastify" {
  interface FastifyRequest {
    user?: any; // replace with better-auth user type later
    session?: any; // replace with better-auth session type later
  }
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authPluginAsync: FastifyPluginAsync = async (fastify) => {
  const handler = toNodeHandler(auth);

  fastify.all("/api/auth/*", async (request, reply) => {
    await handler(request.raw, reply.raw);
  });

  fastify.decorate("requireAuth", async function (request: FastifyRequest, reply: FastifyReply) {
    // Construct headers for better-auth
    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.append(key, value);
        }
      }
    }

    const session = await (auth.api as any).getSession({
      headers,
    });

    if (!session || !session.user) {
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }

    request.user = session.user;
    request.session = session.session;
  });
  
  fastify.decorate("requireRole", function (roles: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.user) {
        reply.status(401).send({ error: "Unauthorized" });
        return;
      }
      
      const userRole = request.user.role || "VIEWER";
      
      if (!roles.includes(userRole) && userRole !== "SUPER_ADMIN") {
        reply.status(403).send({ error: "Forbidden: Insufficient role capabilities" });
        return;
      }
    };
  });
};

export const authPlugin = fp(authPluginAsync);
