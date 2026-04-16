import {
  type Response,
  Router,
  type RouterType,
} from '@/infra/server/core/Modules';
import type { IResult } from '@/shared/http/Result';
import logger from '@/shared/logger';
import { monitoring } from '@/shared/providers/monitoring';

export default class BaseController {
  public router: RouterType;

  constructor(name: string) {
    this.router = Router();
    logger.info(`${name} Controller initialized`);

    monitoring.recordCustomEvent('ControllerInitialized', {
      controllerName: name,
    });
  }

  handleResult(res: Response, result: IResult<unknown>): void {
    const requestLogger = res.req?.log ?? logger;
    const requestId = res.req?.id;

    monitoring.recordMetric('Custom/API/Response', 1);
    monitoring.recordMetric(
      `Custom/API/Response/${result.success ? 'Success' : 'Error'}`,
      1,
    );

    if (!result.success) {
      requestLogger.warn({
        message: 'API Response Error',
        statusCode: result.statusCode,
        error: result.message,
        url: res.req?.url,
        method: res.req?.method,
        requestId,
      });
    }

    res.status(+result.statusCode).json(result.toResultDto());
  }
}
