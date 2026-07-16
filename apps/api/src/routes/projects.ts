import type { FastifyPluginAsync } from 'fastify';
import { db, projects, projectApplications } from '@csea/database';

export const projectsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // GET all projects
  fastify.get('/', async (request, reply) => {
    const allProjects = await db.select().from(projects);
    return allProjects;
  });

  // POST create a project application (placeholder — will be fully implemented in Phase 2C)
  fastify.post('/:id/apply', async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    
    const [application] = await db.insert(projectApplications).values({
      projectId: id,
      applicantName: body.applicantName || "Unknown",
      email: body.email || "",
      statement: body.details || body.statement,
      status: "PENDING"
    }).returning();
    
    return application;
  });
};
