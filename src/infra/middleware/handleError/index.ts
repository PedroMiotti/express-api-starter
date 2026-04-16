import type { NextFunction, Request, Response } from 'express';
import type { ApplicationError } from '@/shared/error/ApplicationError';
import { Result } from '@/shared/http/Result';
import logger from '@/shared/logger';
import { monitoring } from '@/shared/providers/MonitoringHandler/NewRelic';

class HandlerErrorMiddleware {
  public handler(
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const result = new Result();

    monitoring.noticeError(err, {
      url: req.url,
      method: req.method,
      statusCode: err.errorCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    if (err?.name === 'ApplicationError') {
      result.setError(err.message, err.errorCode);
      logger.warn('Application Error', {
        error: err.message,
        code: err.errorCode,
        url: req.url,
        method: req.method,
      });
    } else {
      logger.error('Unexpected Error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
      });
      result.setError('SOMETHING_WENT_WRONG', 500);
    }

    if (res.headersSent) {
      next(result);
      return;
    }

    res.status(+result.statusCode).send(result);
  }
}

export default new HandlerErrorMiddleware();
