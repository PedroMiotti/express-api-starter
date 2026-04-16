export type ApplicationErrorInput = {
  title: string;
  detail: string;
  status: number;
  code: string;
  type?: string;
  instance?: string;
  isOperational?: boolean;
  cause?: unknown;
};

export class ApplicationError extends Error {
  public readonly title: string;
  public readonly detail: string;
  public readonly status: number;
  public readonly code: string;
  public readonly type: string;
  public readonly instance?: string;
  public readonly isOperational: boolean;
  public readonly errorCode: number;

  public constructor(input: ApplicationErrorInput) {
    super(input.detail, input.cause ? { cause: input.cause } : undefined);
    this.name = 'ApplicationError';
    this.title = input.title;
    this.detail = input.detail;
    this.status = input.status;
    this.code = input.code;
    this.type = input.type ?? 'about:blank';
    this.instance = input.instance;
    this.isOperational = input.isOperational ?? true;
    this.errorCode = input.status;
  }
}
