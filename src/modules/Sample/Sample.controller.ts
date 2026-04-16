import type { NextFunction, Request, Response } from 'express';
import { TokenClaims } from '@/infra/middleware/authorization';
import { validate } from '@/infra/middleware/validation';
import BaseController from '@/shared/base/BaseController';
import { ApplicationError } from '@/shared/error/ApplicationError';
import type { TypedRequest } from '@/shared/http/TypedRequest';
import { GetPrivateSampleSchema } from './schemas/GetPrivateSample.schema';
import { getPrivateSampleUseCase, getSampleUseCase } from './useCases';

class SampleController extends BaseController {
  private readonly baseUrl = 'sample';

  constructor() {
    super('Sample');
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`/${this.baseUrl}`, this.getSample.bind(this));
    this.router.get(
      `/${this.baseUrl}/private`,
      [TokenClaims, validate(GetPrivateSampleSchema)],
      this.getPrivateSample.bind(this),
    );
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

  private async getPrivateSample(
    req: TypedRequest<typeof GetPrivateSampleSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.claims) {
        throw new ApplicationError({
          title: 'Unauthorized',
          detail: 'Missing token claims.',
          status: 401,
          code: 'MISSING_TOKEN_CLAIMS',
          type: '/problems/unauthorized',
        });
      }
      const result = await getPrivateSampleUseCase.execute({
        actorId: req.claims.id,
        includeMeta: req.query.includeMeta ?? false,
      });
      this.handleResult(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new SampleController();
