// @ts-nocheck
import fp from "fastify-plugin";
import { auth } from "@csea/auth";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { toNodeHandler } from "better-auth/node";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
    session?: any;
  }
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("requireAuth", async function (request: FastifyRequest, reply: FastifyReply) {
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

  // Encapsulated sub-plugin for auth routes to isolate raw stream body parsers
  fastify.register(async (authInstance) => {
    authInstance.addContentTypeParser("application/json", (req, payload, done) => {
      done(null, payload);
    });
    
    authInstance.addContentTypeParser("text/plain", (req, payload, done) => {
      done(null, payload);
    });

    const handler = toNodeHandler(auth);

    authInstance.all("/*", async (request, reply) => {
      const origin = request.headers.origin;
      const isLocalhost = origin && (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1"
      );
      
      if (isLocalhost) {
        reply.raw.setHeader("Access-Control-Allow-Origin", origin);
        reply.raw.setHeader("Access-Control-Allow-Credentials", "true");
        reply.raw.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        reply.raw.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
      }

      if (request.method === "OPTIONS") {
        reply.raw.statusCode = 204;
        reply.raw.end();
        reply.sent = true;
        return;
      }

      if (request.raw.url?.includes("/sign-up/email") || request.raw.url?.includes("/signup")) {
        reply.status(403).send({ error: "Public registration is disabled." });
        return;
      }
      
      await handler(request.raw, reply.raw);
      reply.sent = true;
    });
  }, { prefix: "/api/auth" });
};

export const authPlugin = fp(authPluginAsync);
