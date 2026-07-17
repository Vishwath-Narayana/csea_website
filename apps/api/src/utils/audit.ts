import { db, auditLogs } from '@csea/database';
import type { FastifyRequest } from 'fastify';

type AuditAction = 
  | 'EVENT_CREATED' | 'EVENT_UPDATED' | 'EVENT_DELETED' | 'EVENT_PUBLISHED'
  | 'PROJECT_CREATED' | 'PROJECT_UPDATED' | 'PROJECT_DELETED'
  | 'JOURNAL_CREATED' | 'JOURNAL_UPDATED' | 'JOURNAL_PUBLISHED' | 'JOURNAL_DELETED'
  | 'GALLERY_CREATED' | 'GALLERY_UPDATED' | 'GALLERY_DELETED'
  | 'SETTINGS_UPDATED'
  | 'USER_ROLE_UPDATED' | 'USER_INVITED' | 'USER_DELETED';

type EntityType = 'event' | 'project' | 'journal_post' | 'gallery' | 'setting' | 'platform_settings' | 'user';

interface LogParams {
  request: FastifyRequest;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  description?: string;
  metadata?: any;
}

export async function logAudit(params: LogParams) {
  try {
    const user = (params.request as any).user;
    const userId = user?.id || null;
    const ipAddress = params.request.ip;
    const userAgent = params.request.headers['user-agent'];

    await db.insert(auditLogs).values({
      userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description,
      metadata: params.metadata,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    params.request.log.error({ err }, 'Failed to write audit log');
  }
}
