import winston, { createLogger, format, transports } from 'winston';

const { timestamp, combine, errors, json, printf } = format;

const buildProdLogger = () => {
  const isMonitoringEnabled = process.env.IS_MONITORING_ENABLED === 'true';

  let logFormat: ReturnType<typeof combine>;

  const errorObjectFormat = printf(
    ({ level, message, timestamp, stack, ...meta }) => {
      return `${Object.keys(meta).length > 0 ? JSON.stringify(meta) : ''}`;
    },
  );

  if (isMonitoringEnabled) {
    try {
      const newrelicFormatter = require('@newrelic/winston-enricher')(winston);
      logFormat = combine(
        timestamp(),
        errors({ stack: true }),
        newrelicFormatter(),
        json(),
        errorObjectFormat,
      );
    } catch {
      logFormat = combine(
        timestamp(),
        errors({ stack: true }),
        json(),
        errorObjectFormat,
      );
    }
  } else {
    logFormat = combine(
      timestamp(),
      errors({ stack: true }),
      json(),
      errorObjectFormat,
    );
  }

  return createLogger({
    format: logFormat,
    transports: [
      new transports.Console({
        level: 'info',
      }),
    ],
  });
};

export default buildProdLogger();
