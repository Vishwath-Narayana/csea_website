import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: true,
  credentials: true,
});

import { publicEventsRoutes } from "./routes/public/events";
import { controlEventsRoutes } from "./routes/control/events";
import { publicProjectsRoutes } from "./routes/public/projects";
import { controlProjectsRoutes } from "./routes/control/projects";
import { publicJournalRoutes } from "./routes/public/journal";
import { controlJournalRoutes } from "./routes/control/journal";
import { publicGalleriesRoutes } from "./routes/public/galleries";
import { controlGalleriesRoutes } from "./routes/control/galleries";
import { controlSettingsRoutes } from "./routes/control/settings";
import { controlUsersRoutes } from "./routes/control/users";
import { authPlugin } from "./plugins/auth";
import { bootstrapAdmin } from "./utils/bootstrap";
import { errorHandler } from "./utils/errors";

fastify.setErrorHandler(errorHandler);

fastify.get("/api/v1/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

fastify.register(authPlugin);
fastify.register(publicEventsRoutes, { prefix: '/api/v1/events' });
fastify.register(controlEventsRoutes, { prefix: '/api/v1/control/events' });
fastify.register(publicProjectsRoutes, { prefix: '/api/v1/projects' });
fastify.register(controlProjectsRoutes, { prefix: '/api/v1/control/projects' });
fastify.register(publicJournalRoutes, { prefix: '/api/v1/journal' });
fastify.register(controlJournalRoutes, { prefix: '/api/v1/control/journal' });
fastify.register(publicGalleriesRoutes, { prefix: '/api/v1/galleries' });
fastify.register(controlGalleriesRoutes, { prefix: '/api/v1/control/galleries' });
fastify.register(controlSettingsRoutes, { prefix: '/api/v1/control/settings' });
fastify.register(controlUsersRoutes, { prefix: '/api/v1/control/users' });

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
