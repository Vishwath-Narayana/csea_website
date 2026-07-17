import type { FastifyPluginAsync } from 'fastify';
import { db, galleries, galleryPhotos } from '@csea/database';
import { eq, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';

export const publicGalleriesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    // Only return PUBLIC galleries
    const conditions = eq(galleries.visibility, 'PUBLIC');

    const allGalleries = await db.select().from(galleries)
      .where(conditions)
      .orderBy(desc(galleries.createdAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(galleries)
      .where(conditions);
    
    return {
      data: allGalleries,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    
    const [gallery] = await db.select().from(galleries)
      .where(eq(galleries.slug, slug));
      
    if (!gallery || gallery.visibility !== 'PUBLIC') {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Gallery not found' } });
    }
    
    // Fetch photos for the gallery
    const photos = await db.select().from(galleryPhotos)
      .where(eq(galleryPhotos.galleryId, gallery.id))
      .orderBy(galleryPhotos.sortOrder);

    return { data: { ...gallery, photos } };
  });
};
