import type { FastifyPluginAsync } from 'fastify';
import { db, journalPosts, users } from '@csea/database';
import { eq, and, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';

export const publicJournalRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    const conditions = and(
      eq(journalPosts.visibility, 'PUBLIC'),
      eq(journalPosts.status, 'PUBLISHED')
    );

    // Join with users to get the author's name
    const allPosts = await db.select({
      id: journalPosts.id,
      title: journalPosts.title,
      slug: journalPosts.slug,
      excerpt: journalPosts.excerpt,
      coverImage: journalPosts.coverImage,
      category: journalPosts.category,
      publishedAt: journalPosts.publishedAt,
      authorId: journalPosts.authorId,
      authorName: users.name
    }).from(journalPosts)
      .leftJoin(users, eq(journalPosts.authorId, users.id))
      .where(conditions)
      .orderBy(desc(journalPosts.publishedAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(journalPosts)
      .where(conditions);
    
    return {
      data: allPosts,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    
    const [post] = await db.select({
      id: journalPosts.id,
      title: journalPosts.title,
      slug: journalPosts.slug,
      excerpt: journalPosts.excerpt,
      content: journalPosts.content,
      coverImage: journalPosts.coverImage,
      category: journalPosts.category,
      publishedAt: journalPosts.publishedAt,
      authorId: journalPosts.authorId,
      authorName: users.name
    }).from(journalPosts)
      .leftJoin(users, eq(journalPosts.authorId, users.id))
      .where(
        and(
          eq(journalPosts.slug, slug),
          eq(journalPosts.visibility, 'PUBLIC'),
          eq(journalPosts.status, 'PUBLISHED')
        )
      );
      
    if (!post) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Journal post not found' } });
    }
    
    return { data: post };
  });
};
