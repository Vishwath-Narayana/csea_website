import type { FastifyPluginAsync } from 'fastify';
import { db, events } from '@csea/database';

export const eventsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // GET all events
  fastify.get('/', async (request, reply) => {
    const allEvents = await db.select().from(events);
    return allEvents;
  });

  // POST create an event (placeholder — will be fully implemented in Phase 2C)
  fastify.post('/', async (request, reply) => {
    const body = request.body as any;
    const [newEvent] = await db.insert(events).values({
      title: body.title,
      slug: body.slug,
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      venue: body.venue,
      status: body.status || "DRAFT",
    }).returning();
    return newEvent;
  });
};
