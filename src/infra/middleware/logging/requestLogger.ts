import crypto from 'node:crypto';
import pinoHttp from 'pino-http';
import logger from '@/shared/logger';

const getRequestId = (
  requestIdHeader: string | string[] | undefined,
): string => {
  if (
    typeof requestIdHeader === 'string' &&
    requestIdHeader.trim().length > 0
  ) {
    return requestIdHeader;
  }

  return crypto.randomUUID();
};

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const requestId = getRequestId(req.headers['x-request-id']);
    res.setHeader('x-request-id', requestId);
    return requestId;
  },
  customLogLevel: (_, res, error) => {
    if (error || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) =>
    `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req, res) =>
    `${req.method} ${req.url} ${res.statusCode}`,
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      path: req.url,
      remoteAddress: req.socket?.remoteAddress ?? req.ip,
      remotePort: req.socket?.remotePort,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
