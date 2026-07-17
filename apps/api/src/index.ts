import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: true,
  credentials: true,
});

import { eventsRoutes } from "./routes/events";
import { projectsRoutes } from "./routes/projects";
import { authPlugin } from "./plugins/auth";
import { bootstrapAdmin } from "./utils/bootstrap";

fastify.get("/api/v1/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

fastify.register(authPlugin);
fastify.register(eventsRoutes, { prefix: '/api/v1/events' });
fastify.register(projectsRoutes, { prefix: '/api/v1/projects' });

fastify.register(async (instance) => {
  instance.get("/api/v1/admin/test", { onRequest: [instance.requireAuth] }, async (request, reply) => {
    return { status: "authenticated", user: request.user };
  });

  instance.get("/api/v1/admin/role-test", { 
    onRequest: [instance.requireAuth, instance.requireRole(["SUPER_ADMIN", "ADMIN"])] 
  }, async (request, reply) => {
    return { status: "authorized", role: request.user.role };
  });
});

const start = async () => {
  try {
    await bootstrapAdmin();
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("API Server listening on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
