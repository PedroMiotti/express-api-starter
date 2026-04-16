import type { Server } from 'node:http';
import { prisma } from '@/infra/database/prisma';
import logger from '@/shared/logger';
import { monitoring } from '@/shared/providers/monitoring';
import { shutdownState } from './state';

type ShutdownReason =
  | 'SIGTERM'
  | 'SIGINT'
  | 'UNCAUGHT_EXCEPTION'
  | 'UNHANDLED_REJECTION';

type ShutdownOptions = {
  forceExitMs: number;
};

export class ShutdownOrchestrator {
  private isShuttingDown = false;

  private readonly server: Server;

  private readonly options: ShutdownOptions;

  private forceExitTimer: NodeJS.Timeout | null = null;

  public constructor(server: Server, options?: Partial<ShutdownOptions>) {
    this.server = server;
    this.options = {
      forceExitMs: options?.forceExitMs ?? 10_000,
    };
  }

  public async shutdown(
    reason: ShutdownReason,
    exitCode: number,
  ): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn({ message: 'Shutdown already in progress', reason });
      return;
    }

    this.isShuttingDown = true;
    shutdownState.markShuttingDown();
    logger.info({ message: 'Graceful shutdown started', reason });

    this.forceExitTimer = setTimeout(() => {
      logger.fatal({ message: 'Forced shutdown timeout reached', reason });
      process.exit(1);
    }, this.options.forceExitMs);
    this.forceExitTimer.unref();

    try {
      await new Promise<void>((resolve, reject) => {
        this.server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      await prisma.$disconnect();
      monitoring.recordCustomEvent('GracefulShutdown', {
        reason,
        status: 'completed',
      });
      logger.info({ message: 'Graceful shutdown completed', reason });
      process.exit(exitCode);
    } catch (error: unknown) {
      logger.error({ err: error, message: 'Graceful shutdown failed', reason });
      process.exit(1);
    } finally {
      if (this.forceExitTimer) {
        clearTimeout(this.forceExitTimer);
        this.forceExitTimer = null;
      }
    }
  }
}
