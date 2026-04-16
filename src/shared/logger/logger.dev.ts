import { createLogger, format, transports } from 'winston';

const { timestamp, combine, printf, errors, colorize } = format;

const buildDevLogger = () => {
  const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return `${timestamp} ${level}: ${stack || message} ${Object.keys(meta).length > 0 ? JSON.stringify(meta) : ''}`;
  });

  return createLogger({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });
};

export default buildDevLogger();
