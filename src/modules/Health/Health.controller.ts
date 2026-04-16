import type { NextFunction, Request, Response } from 'express';
import config from '@/infra/config';
import BaseController from '@/shared/base/BaseController';
import { getReadinessUseCase } from './useCases';

class HealthController extends BaseController {
  constructor() {
    super('Health');
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/health/live', (_req, res) => {
      const body: {
        status: string;
        version?: string;
        commit?: string;
      } = { status: 'alive' };

      if (config.health.appVersion) {
        body.version = config.health.appVersion;
      }

      if (config.health.gitCommit) {
        body.commit = config.health.gitCommit;
      }

      res.status(200).json(body);
    });

    this.router.get('/health/ready', this.getReady.bind(this));
  }

  private async getReady(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { httpStatus, body } = await getReadinessUseCase.execute();
      res.status(httpStatus).json(body);
    } catch (error) {
      next(error);
    }
  }
}

export default new HealthController();
