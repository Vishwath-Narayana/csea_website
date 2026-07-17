import type { FastifyPluginAsync } from 'fastify';
import { db, projects } from '@csea/database';
import { eq, inArray, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';

export const publicProjectsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    // Only return projects that are not drafts or archived
    const conditions = inArray(projects.status, ['RECRUITING', 'ACTIVE', 'COMPLETED']);

    const allProjects = await db.select().from(projects)
      .where(conditions)
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(conditions);
    
    return {
      data: allProjects,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    
    const [project] = await db.select().from(projects)
      .where(eq(projects.slug, slug));
      
    if (!project || project.status === 'DRAFT' || project.status === 'ARCHIVED') {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }
    
    return { data: project };
  });
};
