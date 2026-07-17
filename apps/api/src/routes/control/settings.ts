import type { FastifyPluginAsync } from 'fastify';

// In a real application, these settings would be stored in a database table or redis.
let mockSettings = {
  platformName: "CSEA Digital Platform",
  supportEmail: "support@csea.kitsw.ac.in",
  metaDescription: "The official platform for Computer Science & Engineering Association, KITSW.",
  maintenanceMode: false
};

export const controlSettingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', fastify.requireAuth);
  fastify.addHook('onRequest', fastify.requireRole(["SUPER_ADMIN", "ADMIN"]));

  fastify.get('/', async (request, reply) => {
    return { data: mockSettings };
  });

  fastify.patch('/', async (request, reply) => {
    const updates = request.body as Record<string, any>;
    mockSettings = { ...mockSettings, ...updates };
    return { data: mockSettings };
  });
};
