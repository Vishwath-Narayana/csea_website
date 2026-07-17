import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.format(),
      }
    });
  }

  // 23505 is PostgreSQL unique violation error code
  if ((error as any).code === '23505') {
    return reply.status(409).send({
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists (unique constraint violation)',
        details: { constraint: (error as any).constraint },
      }
    });
  }

  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code || 'HTTP_ERROR',
        message: error.message,
      }
    });
  }

  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    }
  });
}
