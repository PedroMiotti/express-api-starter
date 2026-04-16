export class ResultDto {
  message: string;
  error: string | string[];
  data: unknown;
  statusCode: number;
  success: boolean;
}

export interface IResult<T> {
  data: T;
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string | string[];
  setData(data: T, statusCode: number | string): void;
  setData(data: T, statusCode: number | string, message: string): void;
  setStatusCode(statusCode: number | string, success: boolean): void;
  setError(error: string | string[], statusCode: number | string): void;
  setMessage(message: string, statusCode: number | string): void;
  toResultDto(): ResultDto;
}

export class Result<T> implements IResult<T> {
  data: T;
  statusCode: number | string;
  success = true;
  message: string;
  error: string | string[];

  setData(data: T, statusCode: number | string, message?: string): void {
    this.data = data;
    this.statusCode = statusCode;

    if (message) this.message = message;
  }

  setStatusCode(statusCode: number | string, success: boolean): void {
    this.statusCode = statusCode;
    this.success = success;
  }

  setMessage(message: string, statusCode: number | string): void {
    this.message = message;
    this.statusCode = statusCode;
  }

  setError(error: string | string[], statusCode: number | string): void {
    this.success = false;
    this.error = error;
    this.statusCode = statusCode;
  }

  toResultDto(): ResultDto {
    return {
      statusCode: +this.statusCode,
      success: this.success,
      data: this.data,
      error: this.error,
      message: this.message,
    };
  }
}
