import type { NextFunction, Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';

import { ApplicationError } from '@/shared/error/ApplicationError';
import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';
import type { TokenPayloadDto } from '@/shared/types/tokenPayload';

export const TokenClaims = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.headers.authorization;

    if (!token)
      throw new ApplicationError(
        'The resource you are trying to access is protected. No authorization token was provided.',
        ApplicationStatusCodes.UNAUTHORIZED,
      );

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2)
      throw new ApplicationError(
        'The authorization token is invalid. Please provide a valid token.',
        ApplicationStatusCodes.UNAUTHORIZED,
      );

    if (tokenParts[0] !== 'Bearer')
      throw new ApplicationError(
        'The authorization token is invalid. Please provide a valid token.',
        ApplicationStatusCodes.UNAUTHORIZED,
      );

    req.claims = jwtDecode<TokenPayloadDto>(tokenParts[1]);

    next();
  } catch {
    throw new ApplicationError(
      'The authorization token is invalid. Please provide a valid token.',
      ApplicationStatusCodes.UNAUTHORIZED,
    );
  }
};
