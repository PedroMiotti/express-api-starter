import { TokenPayloadDto } from '@/shared/types/tokenPayload';

declare module 'express-serve-static-core' {
  interface Request {
    /** Set by `TokenClaims` middleware when present */
    claims?: TokenPayloadDto;
    /** Optional upload reference used by validation middleware */
    file?: unknown;
  }
}
