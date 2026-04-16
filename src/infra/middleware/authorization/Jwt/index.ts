import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ApplicationError } from '@/shared/error/ApplicationError';
import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';
import type { TokenPayloadDto } from '@/shared/types/tokenPayload';

type RequestWithClaims = Request & { claims?: TokenPayloadDto };

export const TokenClaims = (
  req: RequestWithClaims,
  _: Response,
  next: NextFunction,
): void => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ApplicationError({
        title: 'Unauthorized',
        detail: 'JWT secret is not configured.',
        status: Number(ApplicationStatusCodes.UNAUTHORIZED),
        code: 'JWT_SECRET_MISSING',
        type: '/problems/auth-config-error',
      });
    }

    const token = req.headers.authorization;

    if (!token)
      throw new ApplicationError({
        title: 'Unauthorized',
        detail:
          'The resource you are trying to access is protected. No authorization token was provided.',
        status: Number(ApplicationStatusCodes.UNAUTHORIZED),
        code: 'MISSING_AUTHORIZATION_HEADER',
        type: '/problems/unauthorized',
      });

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2)
      throw new ApplicationError({
        title: 'Unauthorized',
        detail:
          'The authorization token is invalid. Please provide a valid token.',
        status: Number(ApplicationStatusCodes.UNAUTHORIZED),
        code: 'INVALID_AUTHORIZATION_HEADER',
        type: '/problems/unauthorized',
      });

    if (tokenParts[0] !== 'Bearer')
      throw new ApplicationError({
        title: 'Unauthorized',
        detail:
          'The authorization token is invalid. Please provide a valid token.',
        status: Number(ApplicationStatusCodes.UNAUTHORIZED),
        code: 'INVALID_AUTHORIZATION_SCHEME',
        type: '/problems/unauthorized',
      });

    const decoded = jwt.verify(tokenParts[1], jwtSecret) as TokenPayloadDto;
    req.claims = decoded;

    next();
  } catch (error: unknown) {
    if (error instanceof ApplicationError) {
      throw error;
    }

    throw new ApplicationError({
      title: 'Unauthorized',
      detail:
        'The authorization token is invalid. Please provide a valid token.',
      status: Number(ApplicationStatusCodes.UNAUTHORIZED),
      code: 'INVALID_TOKEN',
      type: '/problems/unauthorized',
      cause: error,
    });
  }
};
