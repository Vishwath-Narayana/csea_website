import type { FastifyPluginAsync } from 'fastify';
import { db, galleries, galleryPhotos } from '@csea/database';
import { eq, desc, sql } from 'drizzle-orm';
import { parsePaginationArgs, getPaginationMeta } from '../../utils/pagination';
import { createGallerySchema, updateGallerySchema } from '@csea/validation';
import { logAudit } from '../../utils/audit';
import { z } from 'zod';

const createPhotoSchema = z.object({
  url: z.string().url(),
  fileName: z.string()
});

export const controlGalleriesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', fastify.requireAuth);

  // Get all galleries
  fastify.get('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { page, limit, offset } = parsePaginationArgs(request.query);
    
    const allGalleries = await db.select().from(galleries)
      .orderBy(desc(galleries.createdAt))
      .limit(limit)
      .offset(offset);
      
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(galleries);
    
    return {
      data: allGalleries,
      meta: getPaginationMeta(Number(countResult?.count || 0), page, limit)
    };
  });

  // Get single gallery with photos
  fastify.get('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const [gallery] = await db.select().from(galleries).where(eq(galleries.id, id));
      
    if (!gallery) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Gallery not found' } });
    }
    
    const photos = await db.select().from(galleryPhotos)
      .where(eq(galleryPhotos.galleryId, gallery.id))
      .orderBy(galleryPhotos.sortOrder);

    return { data: { ...gallery, photos } };
  });

  // Create gallery
  fastify.post('/', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const body = createGallerySchema.parse(request.body);
    
    let eventDate = body.eventDate ? new Date(body.eventDate) : null;
    
    const [newGallery] = await db.insert(galleries).values({
      ...body,
      eventDate
    } as any).returning();

    await logAudit({
      request,
      action: 'GALLERY_CREATED',
      entityType: 'gallery',
      entityId: newGallery.id,
      description: `Created gallery: ${newGallery.title}`
    });

    return reply.status(201).send({ data: newGallery });
  });

  // Update gallery
  fastify.patch('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateGallerySchema.parse(request.body);

    const [updatedGallery] = await db.update(galleries)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(galleries.id, id))
      .returning();

    if (!updatedGallery) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Gallery not found' } });
    }

    await logAudit({
      request,
      action: 'GALLERY_UPDATED',
      entityType: 'gallery',
      entityId: updatedGallery.id,
      description: `Updated gallery: ${updatedGallery.title}`
    });

    return { data: updatedGallery };
  });

  // Delete gallery
  fastify.delete('/:id', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const [deletedGallery] = await db.delete(galleries).where(eq(galleries.id, id)).returning();

    if (!deletedGallery) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Gallery not found' } });
    }

    await logAudit({
      request,
      action: 'GALLERY_DELETED',
      entityType: 'gallery',
      entityId: deletedGallery.id,
      description: `Deleted gallery: ${deletedGallery.title}`
    });

    return reply.status(204).send();
  });

  // Add Photo (External URL)
  fastify.post('/:id/photos', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = createPhotoSchema.parse(request.body);

    const [newPhoto] = await db.insert(galleryPhotos).values({
      galleryId: id,
      url: body.url,
      fileName: body.fileName,
      sortOrder: 0
    }).returning();

    return reply.status(201).send({ data: newPhoto });
  });

  // Delete Photo
  fastify.delete('/:id/photos/:photoId', { onRequest: [fastify.requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"])] }, async (request, reply) => {
    const { photoId } = request.params as { photoId: string };
    
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, photoId));
    return reply.status(204).send();
  });
};
