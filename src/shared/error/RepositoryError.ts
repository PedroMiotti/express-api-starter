import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';
import { ApplicationError } from './ApplicationError';

export class RepositoryError extends ApplicationError {
  public constructor(message: string, cause?: unknown) {
    super({
      title: 'Repository failure',
      detail: message,
      status: Number(ApplicationStatusCodes.INTERNAL_ERROR),
      code: 'REPOSITORY_ERROR',
      type: '/problems/repository-error',
      cause,
    });
    this.name = 'RepositoryError';
  }
}
