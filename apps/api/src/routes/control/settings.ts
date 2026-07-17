import type { FastifyPluginAsync } from 'fastify';
import { db, platformSettings, auditLogs } from '@csea/database';
import { eq, desc } from 'drizzle-orm';
import { logAudit } from '../../utils/audit';

const DEFAULT_SETTINGS = {
  platformName: "CSEA Digital Platform",
  supportEmail: "support@csea.kitsw.ac.in",
  metaDescription: "The official platform for Computer Science & Engineering Association, KITSW.",
  maintenanceMode: false
};

export const controlSettingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', fastify.requireAuth);
  fastify.addHook('onRequest', fastify.requireRole(["SUPER_ADMIN", "ADMIN"]));

  fastify.get('/', async (request, reply) => {
    const settingsRows = await db.select().from(platformSettings);
    
    // Convert array of key-value rows into a single object, merging with defaults
    let currentSettings = { ...DEFAULT_SETTINGS };
    
    for (const row of settingsRows) {
      if (row.key === 'global') {
        currentSettings = { ...currentSettings, ...(row.value as Record<string, any>) };
      }
    }

    return { data: currentSettings };
  });

  fastify.patch('/', async (request, reply) => {
    const updates = request.body as Record<string, any>;
    
    // Fetch current to merge
    const [existingRow] = await db.select().from(platformSettings).where(eq(platformSettings.key, 'global'));
    let currentValue = existingRow ? (existingRow.value as Record<string, any>) : { ...DEFAULT_SETTINGS };
    
    const newValue = { ...currentValue, ...updates };

    await db.insert(platformSettings)
      .values({
        key: 'global',
        value: newValue,
        updatedAt: new Date(),
        updatedBy: request.user?.id
      })
      .onConflictDoUpdate({
        target: platformSettings.key,
        set: {
          value: newValue,
          updatedAt: new Date(),
          updatedBy: request.user?.id
        }
      });

    await logAudit({
      request,
      action: 'SETTINGS_UPDATED',
      entityType: 'platform_settings',
      entityId: 'global',
      description: `Updated platform settings keys: ${Object.keys(updates).join(', ')}`
    });

    return { data: newValue };
  });

  fastify.get('/audit-logs', async (request, reply) => {
    const logs = await db.select().from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);
    return { data: logs };
  });
};
