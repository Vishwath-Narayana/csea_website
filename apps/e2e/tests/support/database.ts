import { client, db, events, journalPosts, projects, galleries, galleryPhotos } from '@csea/database';
import { eq, inArray } from 'drizzle-orm';

export async function findEventBySlug(slug: string) {
  const [event] = await db.select().from(events).where(eq(events.slug, slug));
  return event ?? null;
}

export async function deleteEventsBySlug(slugs: string[]) {
  if (slugs.length === 0) return;

  await db.delete(events).where(inArray(events.slug, slugs));
}

export async function findJournalBySlug(slug: string) {
  const [article] = await db.select().from(journalPosts).where(eq(journalPosts.slug, slug));
  return article ?? null;
}

export async function deleteJournalBySlug(slugs: string[]) {
  if (slugs.length === 0) return;

  await db.delete(journalPosts).where(inArray(journalPosts.slug, slugs));
}

export async function findProjectBySlug(slug: string) {
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
  return project ?? null;
}

export async function deleteProjectBySlug(slugs: string[]) {
  if (slugs.length === 0) return;

  await db.delete(projects).where(inArray(projects.slug, slugs));
}

export async function findGalleryBySlug(slug: string) {
  const [gallery] = await db.select().from(galleries).where(eq(galleries.slug, slug));
  return gallery ?? null;
}

export async function deleteGalleryBySlug(slugs: string[]) {
  if (slugs.length === 0) return;

  await db.delete(galleries).where(inArray(galleries.slug, slugs));
}

export async function findPhotosByGallerySlug(gallerySlug: string) {
  const gallery = await findGalleryBySlug(gallerySlug);
  if (!gallery) return [];

  const photos = await db.select().from(galleryPhotos).where(eq(galleryPhotos.galleryId, gallery.id));
  return photos;
}

export async function closeDatabase() {
  await client.end({ timeout: 5 });
}
