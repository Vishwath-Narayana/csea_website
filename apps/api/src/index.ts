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

fastify.get("/api/v1/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

fastify.register(eventsRoutes, { prefix: '/api/v1/events' });
fastify.register(projectsRoutes, { prefix: '/api/v1/projects' });

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("API Server listening on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
