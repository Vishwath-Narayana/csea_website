import type { FastifyPluginAsync } from 'fastify';
import { db, users } from '@csea/database';
import { eq, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';
import { logAudit } from '../../utils/audit';

export const controlUsersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', fastify.requireAuth);

  // Require SUPER_ADMIN or ADMIN for all user routes
  fastify.addHook('onRequest', fastify.requireRole(["SUPER_ADMIN", "ADMIN"]));

  fastify.get('/', async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      lastActive: users.updatedAt
    }).from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(users);
    
    return {
      data: allUsers,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.patch('/:id/role', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { role } = request.body as { role: string };

    if (!role) {
      return reply.status(400).send({ error: { code: 'BAD_REQUEST', message: 'Role is required' } });
    }

    const [updatedUser] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    await logAudit({
      request,
      action: 'USER_ROLE_UPDATED',
      entityType: 'user',
      entityId: updatedUser.id,
      description: `Updated role for ${updatedUser.email} to ${role}`
    });

    return { data: { id: updatedUser.id, role: updatedUser.role } };
  });

  fastify.post('/invite', async (request, reply) => {
    const { email, role } = request.body as { email: string, role: string };
    
    // In a real application, you'd create a pending user, send an invite email
    // For Phase 2C, we will just create a mock "Pending" user
    const name = email.split('@')[0];

    const [newUser] = await db.insert(users).values({
      email,
      name,
      role: role || 'EDITOR',
    }).returning();

    await logAudit({
      request,
      action: 'USER_INVITED',
      entityType: 'user',
      entityId: newUser.id,
      description: `Invited user ${email} with role ${role}`
    });

    return reply.status(201).send({ data: newUser });
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();

    if (!deletedUser) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    await logAudit({
      request,
      action: 'USER_DELETED',
      entityType: 'user',
      entityId: deletedUser.id,
      description: `Deleted user ${deletedUser.email}`
    });

    return reply.status(204).send();
  });
};
