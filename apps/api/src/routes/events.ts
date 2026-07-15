import type { FastifyPluginAsync } from 'fastify';
import { db, events, eventRegistrations } from '@csea/database';
import { eq } from 'drizzle-orm';

export const eventsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // GET all events
  fastify.get('/', async (request, reply) => {
    const allEvents = await db.select().from(events);
    return allEvents;
  });

  // POST create an event
  fastify.post('/', async (request, reply) => {
    const { title, slug, description, startDate, endDate, venue, capacity } = request.body as any;
    const [newEvent] = await db.insert(events).values({
      title, slug, description, startDate: new Date(startDate), endDate: new Date(endDate), venue, capacity
    }).returning();
    return newEvent;
  });

  // POST register for an event
  fastify.post('/:id/register', async (request, reply) => {
    const { id } = request.params as any;
    const { userId } = request.body as any; // Mocking auth for now
    
    // In a real scenario, check capacity and existing registration
    const [registration] = await db.insert(eventRegistrations).values({
      eventId: id,
      userId,
      status: "REGISTERED"
    }).returning();
    
    return registration;
  });
};
