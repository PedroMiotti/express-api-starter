import path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config();

const isBuildRuntime = __filename.includes(`${path.sep}build${path.sep}`);

if (isBuildRuntime) {
  require('module-alias/register');
}

import App from '@/infra/server/App';
import { ShutdownOrchestrator } from '@/infra/server/shutdown/orchestrator';
import logger from '@/shared/logger';
import { controllers } from './modules';

const app = new App(controllers);
const server = app.start();

const shutdownOrchestrator = new ShutdownOrchestrator(server);

process.on('SIGTERM', () => {
  void shutdownOrchestrator.shutdown('SIGTERM', 0);
});

process.on('SIGINT', () => {
  void shutdownOrchestrator.shutdown('SIGINT', 0);
});

process.on('unhandledRejection', (error: unknown) => {
  logger.error({ err: error, message: 'Unhandled rejection detected' });
  void shutdownOrchestrator.shutdown('UNHANDLED_REJECTION', 1);
});

process.on('uncaughtException', (error: Error) => {
  logger.fatal({ err: error, message: 'Uncaught exception detected' });
  void shutdownOrchestrator.shutdown('UNCAUGHT_EXCEPTION', 1);
});
