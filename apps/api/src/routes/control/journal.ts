import type { FastifyPluginAsync } from 'fastify';
import { db, journalPosts } from '@csea/database';
import { eq, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';
import { createJournalPostSchema, updateJournalPostSchema } from '@csea/validation';
import { logAudit } from '../../utils/audit';
import { sanitizeHtml } from '../../utils/html-sanitizer';

export const controlJournalRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', fastify.requireAuth);

  fastify.get('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    const allPosts = await db.select().from(journalPosts)
      .orderBy(desc(journalPosts.createdAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(journalPosts);
    
    return {
      data: allPosts,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.get('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const [post] = await db.select().from(journalPosts).where(eq(journalPosts.id, id));
      
    if (!post) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Journal post not found' } });
    }
    
    return { data: post };
  });

  fastify.post('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const body = createJournalPostSchema.parse(request.body);

    // Sanitize content server-side
    const sanitizedContent = body.content ? sanitizeHtml(body.content) : '';

    // Automatically set authorId to the current user if not provided
    const authorId = body.authorId || (request as any).user.id;

    // Automatically set publishedAt if status is PUBLISHED
    let publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    if (body.status === 'PUBLISHED' && !publishedAt) {
      publishedAt = new Date();
    }

    const [newPost] = await db.insert(journalPosts).values({
      ...body,
      content: sanitizedContent,
      authorId: request.user!.id,
      publishedAt,
      coverImage: body.coverImage || null,
    } as any).returning();

    await logAudit({
      request,
      action: newPost.status === 'PUBLISHED' ? 'JOURNAL_PUBLISHED' : 'JOURNAL_CREATED',
      entityType: 'journal_post',
      entityId: newPost.id,
      description: `Created journal post: ${newPost.title}`
    });

    return reply.status(201).send({ data: newPost });
  });

  fastify.patch('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateJournalPostSchema.parse(request.body);

    // Sanitize content server-side
    const sanitizedContent = body.content ? sanitizeHtml(body.content) : undefined;

    // If changing to PUBLISHED, set publishedAt if not already set
    let publishedAtUpdate = {};
    if (body.status === 'PUBLISHED') {
      const [existing] = await db.select({ publishedAt: journalPosts.publishedAt }).from(journalPosts).where(eq(journalPosts.id, id));
      if (existing && !existing.publishedAt && !body.publishedAt) {
        publishedAtUpdate = { publishedAt: new Date() };
      }
    }

    const [updatedPost] = await db.update(journalPosts)
      .set({
        ...body,
        ...(sanitizedContent !== undefined && { content: sanitizedContent }),
        ...publishedAtUpdate,
        coverImage: body.coverImage === "" ? null : body.coverImage,
        updatedAt: new Date(),
      })
      .where(eq(journalPosts.id, id))
      .returning();

    if (!updatedPost) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Journal post not found' } });
    }

    await logAudit({
      request,
      action: updatedPost.status === 'PUBLISHED' ? 'JOURNAL_PUBLISHED' : 'JOURNAL_UPDATED',
      entityType: 'journal_post',
      entityId: updatedPost.id,
      description: `Updated journal post: ${updatedPost.title}`
    });

    return { data: updatedPost };
  });

  fastify.delete('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const [deletedPost] = await db.delete(journalPosts).where(eq(journalPosts.id, id)).returning();

    if (!deletedPost) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Journal post not found' } });
    }

    await logAudit({
      request,
      action: 'JOURNAL_DELETED',
      entityType: 'journal_post',
      entityId: deletedPost.id,
      description: `Deleted journal post: ${deletedPost.title}`
    });

    return reply.status(204).send();
  });
};
