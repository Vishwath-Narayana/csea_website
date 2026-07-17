import type { FastifyPluginAsync } from 'fastify';
import { db, events } from '@csea/database';
import { eq, and, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';

export const publicEventsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    const conditions = and(
      eq(events.visibility, 'PUBLIC'),
      eq(events.status, 'PUBLISHED')
    );

    const allEvents = await db.select().from(events)
      .where(conditions)
      .orderBy(desc(events.startDate))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(events)
      .where(conditions);
    
    return {
      data: allEvents,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const [event] = await db.select().from(events)
      .where(
        and(
          eq(events.slug, slug),
          eq(events.visibility, 'PUBLIC'),
          eq(events.status, 'PUBLISHED')
        )
      );
      
    if (!event) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    }
    
    return { data: event };
  });
};
