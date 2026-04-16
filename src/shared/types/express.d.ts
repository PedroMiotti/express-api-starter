import type { Logger } from 'pino';
import type { TokenPayloadDto } from './tokenPayload';

declare namespace Express {
  interface Request {
    claims?: TokenPayloadDto;
    file?: unknown;
    log?: Logger;
  }
}
