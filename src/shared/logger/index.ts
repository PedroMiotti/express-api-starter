import pino from 'pino';

const environment = process.env.ENVIRONMENT ?? 'development';
const isDevelopment = environment === 'development';

const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDevelopment ? 'debug' : 'info'),
  messageKey: 'message',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'authorization',
      'cookie',
      'password',
      'token',
    ],
    censor: '[REDACTED]',
  },
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: true,
        },
      }
    : undefined,
});

export default logger;
