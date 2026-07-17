import type { FastifyPluginAsync } from 'fastify';
import { db, users } from '@csea/database';
import { eq, desc, sql, ne, and } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';
import { logAudit } from '../../utils/audit';
import { z } from 'zod';

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

    const currentUser = request.user!;

    // Fetch target user
    const [targetUser] = await db.select().from(users).where(eq(users.id, id));
    if (!targetUser) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    // Rule: ADMIN cannot modify SUPER_ADMIN or promote to SUPER_ADMIN
    if (currentUser.role === 'ADMIN') {
      if (targetUser.role === 'SUPER_ADMIN' || role === 'SUPER_ADMIN') {
        return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Insufficient privileges' } });
      }
    }

    // Rule: Cannot demote the last SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
      const [superAdminCount] = await db.select({ count: sql<number>`count(*)` })
        .from(users).where(eq(users.role, 'SUPER_ADMIN'));
      
      if (Number(superAdminCount.count) <= 1) {
        return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Cannot demote the last Super Admin' } });
      }
    }

    const [updatedUser] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

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
    
    const currentUser = request.user!;

    // Rule: ADMIN cannot invite a SUPER_ADMIN
    if (currentUser.role === 'ADMIN' && role === 'SUPER_ADMIN') {
      return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Insufficient privileges' } });
    }

    // Immediate account creation (mocking an invite acceptance for Phase 2C)
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
      description: `Invited/Created user ${email} with role ${role}`
    });

    return reply.status(201).send({ data: newUser });
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const currentUser = request.user!;

    // Fetch target user
    const [targetUser] = await db.select().from(users).where(eq(users.id, id));
    if (!targetUser) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    // Rule: Cannot delete yourself
    if (targetUser.id === currentUser.id) {
      return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Cannot delete your own account' } });
    }

    // Rule: ADMIN cannot delete SUPER_ADMIN
    if (currentUser.role === 'ADMIN' && targetUser.role === 'SUPER_ADMIN') {
      return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Insufficient privileges' } });
    }

    // Rule: Cannot delete the last SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN') {
      const [superAdminCount] = await db.select({ count: sql<number>`count(*)` })
        .from(users).where(eq(users.role, 'SUPER_ADMIN'));
      
      if (Number(superAdminCount.count) <= 1) {
        return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Cannot delete the last Super Admin' } });
      }
    }
    
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();

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
