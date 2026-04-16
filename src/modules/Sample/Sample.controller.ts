import type { NextFunction, Request, Response } from 'express';
import BaseController from '@/shared/base/BaseController';
import { getSampleUseCase } from './useCases';

class SampleController extends BaseController {
  private readonly baseUrl = 'sample';

  constructor() {
    super('Sample');
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`/${this.baseUrl}`, this.getSample.bind(this));
  }

  private async getSample(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await getSampleUseCase.execute();
      this.handleResult(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new SampleController();
