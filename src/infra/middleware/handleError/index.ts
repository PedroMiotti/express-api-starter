import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'pino';
import { ApplicationError } from '@/shared/error/ApplicationError';
import { ValidationError } from '@/shared/error/ValidationError';
import type { ProblemDetails } from '@/shared/http/ProblemDetails';
import logger from '@/shared/logger';
import { monitoring } from '@/shared/providers/monitoring';

class HandlerErrorMiddleware {
  private readonly defaultUnexpectedError = 'Something went wrong.';

  public buildNotFoundError(
    detail: string,
    instance?: string,
  ): ApplicationError {
    return new ApplicationError({
      title: 'Not Found',
      detail,
      status: 404,
      code: 'RESOURCE_NOT_FOUND',
      type: '/problems/not-found',
      instance,
    });
  }

  private mapToProblemDetails(
    err: Error,
    requestId: string | undefined,
    instance: string,
  ): ProblemDetails {
    if (err instanceof ApplicationError) {
      return {
        type: err.type,
        title: err.title,
        status: err.status,
        detail: err.detail,
        instance: err.instance ?? instance,
        code: err.code,
        requestId,
        errors: err instanceof ValidationError ? err.errors : undefined,
      };
    }

    return {
      type: '/problems/internal-server-error',
      title: 'Internal Server Error',
      status: 500,
      detail: this.defaultUnexpectedError,
      instance,
      code: 'INTERNAL_SERVER_ERROR',
      requestId,
    };
  }

  /** Arrow keeps `this` when Express calls the function (unbound method loses instance). */
  public handler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const requestId = req.id ? String(req.id) : undefined;
    const problem = this.mapToProblemDetails(err, requestId, req.originalUrl);
    const log: Logger =
      req.log ?? logger.child({ requestId, context: 'error_middleware' });

    monitoring.noticeError(err, {
      url: req.url,
      method: req.method,
      statusCode: problem.status,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      requestId,
      problemCode: problem.code,
    });

    if (problem.status >= 500) {
      log.error(
        {
          err,
          requestId,
          url: req.url,
          method: req.method,
          code: problem.code,
          statusCode: problem.status,
        },
        'Unhandled request error',
      );
    } else {
      log.warn(
        {
          err,
          requestId,
          url: req.url,
          method: req.method,
          code: problem.code,
          statusCode: problem.status,
        },
        'Handled request error',
      );
    }

    if (res.headersSent) {
      next(err);
      return;
    }

    res
      .status(problem.status)
      .setHeader('content-type', 'application/problem+json')
      .json(problem);
  };
}

export default new HandlerErrorMiddleware();
