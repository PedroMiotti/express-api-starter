import { ApplicationError } from './ApplicationError';

export class ValidationError extends ApplicationError {
  public readonly errors: string[];

  public constructor(errors: string[]) {
    super({
      title: 'Invalid request',
      detail: 'Request validation failed.',
      status: 400,
      code: 'VALIDATION_ERROR',
      type: '/problems/validation-error',
    });
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
