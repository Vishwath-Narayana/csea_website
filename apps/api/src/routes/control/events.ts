import type { FastifyPluginAsync } from 'fastify';
import { db, events } from '@csea/database';
import { eq, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';
import { createEventSchema, updateEventSchema } from '@csea/validation';
import { logAudit } from '../../utils/audit';

export const controlEventsRoutes: FastifyPluginAsync = async (fastify) => {
  // Apply auth hooks to all routes in this plugin
  fastify.addHook('onRequest', fastify.requireAuth);
  // Optional: Restrict to specific roles. The prompt said editor/admin for some things.
  // For now, we'll let requireRole handle specific actions.

  fastify.get('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    const allEvents = await db.select().from(events)
      .orderBy(desc(events.createdAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(events);
    
    return {
      data: allEvents,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.get('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const [event] = await db.select().from(events).where(eq(events.id, id));
      
    if (!event) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    }
    
    return { data: event };
  });

  fastify.post('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const body = createEventSchema.parse(request.body);
    
    const [newEvent] = await db.insert(events).values({
      ...body,
      // Handle the case where someone might pass empty strings instead of null
      coverImage: body.coverImage || null,
      meetingUrl: body.meetingUrl || null,
      registrationUrl: body.registrationUrl || null,
      contactEmail: body.contactEmail || null,
    }).returning();

    await logAudit({
      request,
      action: 'EVENT_CREATED',
      entityType: 'event',
      entityId: newEvent.id,
      description: `Created event: ${newEvent.title}`
    });

    return reply.status(201).send({ data: newEvent });
  });

  fastify.patch('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateEventSchema.parse(request.body);

    const [updatedEvent] = await db.update(events)
      .set({
        ...body,
        coverImage: body.coverImage === "" ? null : body.coverImage,
        meetingUrl: body.meetingUrl === "" ? null : body.meetingUrl,
        registrationUrl: body.registrationUrl === "" ? null : body.registrationUrl,
        contactEmail: body.contactEmail === "" ? null : body.contactEmail,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    if (!updatedEvent) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    }

    await logAudit({
      request,
      action: updatedEvent.status === 'PUBLISHED' ? 'EVENT_PUBLISHED' : 'EVENT_UPDATED',
      entityType: 'event',
      entityId: updatedEvent.id,
      description: `Updated event: ${updatedEvent.title}`
    });

    return { data: updatedEvent };
  });

  fastify.delete('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const [deletedEvent] = await db.delete(events).where(eq(events.id, id)).returning();

    if (!deletedEvent) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    }

    await logAudit({
      request,
      action: 'EVENT_DELETED',
      entityType: 'event',
      entityId: deletedEvent.id,
      description: `Deleted event: ${deletedEvent.title}`
    });

    return reply.status(204).send();
  });
};
