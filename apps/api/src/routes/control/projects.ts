import type { FastifyPluginAsync } from 'fastify';
import { db, projects } from '@csea/database';
import { eq, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';
import { createProjectSchema, updateProjectSchema } from '@csea/validation';
import { logAudit } from '../../utils/audit';

export const controlProjectsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', fastify.requireAuth);

  fastify.get('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    const allProjects = await db.select().from(projects)
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(projects);
    
    return {
      data: allProjects,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.get('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
      
    if (!project) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }
    
    return { data: project };
  });

  fastify.post('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const body = createProjectSchema.parse(request.body);
    
    const [newProject] = await db.insert(projects).values({
      ...body,
      coverImage: body.coverImage || null,
      repositoryUrl: body.repositoryUrl || null,
      demoUrl: body.demoUrl || null,
      applicationUrl: body.applicationUrl || null,
    }).returning();

    await logAudit({
      request,
      action: 'PROJECT_CREATED',
      entityType: 'project',
      entityId: newProject.id,
      description: `Created project: ${newProject.title}`
    });

    return reply.status(201).send({ data: newProject });
  });

  fastify.patch('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateProjectSchema.parse(request.body);

    const [updatedProject] = await db.update(projects)
      .set({
        ...body,
        coverImage: body.coverImage === "" ? null : body.coverImage,
        repositoryUrl: body.repositoryUrl === "" ? null : body.repositoryUrl,
        demoUrl: body.demoUrl === "" ? null : body.demoUrl,
        applicationUrl: body.applicationUrl === "" ? null : body.applicationUrl,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updatedProject) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    await logAudit({
      request,
      action: 'PROJECT_UPDATED',
      entityType: 'project',
      entityId: updatedProject.id,
      description: `Updated project: ${updatedProject.title}`
    });

    return { data: updatedProject };
  });

  fastify.delete('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const [deletedProject] = await db.delete(projects).where(eq(projects.id, id)).returning();

    if (!deletedProject) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    await logAudit({
      request,
      action: 'PROJECT_DELETED',
      entityType: 'project',
      entityId: deletedProject.id,
      description: `Deleted project: ${deletedProject.title}`
    });

    return reply.status(204).send();
  });
};
