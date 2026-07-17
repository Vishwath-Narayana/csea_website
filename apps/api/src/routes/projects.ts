import type { FastifyPluginAsync } from 'fastify';
import { db, projects } from '@csea/database';

export const projectsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // GET all projects
  fastify.get('/', async (request, reply) => {
    const allProjects = await db.select().from(projects);
    return allProjects;
  });
};
