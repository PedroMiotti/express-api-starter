import type { Server as HttpServer } from 'node:http';
import cors from 'cors';
import type { NextFunction, Request } from 'express';
import helmet from 'helmet';
import type BaseController from '@/shared/base/BaseController';
import logger from '@/shared/logger';
import AppSettings, { initAppSettings } from '@/shared/settings/AppSettings';
import config from '../config';
import HandlerErrorMiddleware from '../middleware/handleError';
import { requestLogger } from '../middleware/logging/requestLogger';
import {
  type Application,
  BodyParser,
  type Response,
  Server,
} from './core/Modules';

export default class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.setup();
    this.app = Server();
    this.app.set('trust proxy', true);
    this.loadMiddleware();
    this.loadControllers(controllers);
    this.loadNotFoundHandler();
    this.loadErrorHandler();
  }

  public loadMiddleware(): void {
    const allowedOrigins = AppSettings.ServerOrigins.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    this.app.use(helmet());
    this.app.use(requestLogger);
    this.app.use(BodyParser({ limit: '50mb' }));
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
          }

          callback(new Error('Not allowed by CORS'));
        },
      }),
    );
  }

  private loadControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(AppSettings.ServerRoot, controller.router);
    });
  }

  private loadNotFoundHandler(): void {
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      next(
        HandlerErrorMiddleware.buildNotFoundError(
          `${req.method} ${req.originalUrl} not found`,
          req.originalUrl,
        ),
      );
    });
  }

  private loadErrorHandler(): void {
    this.app.use(HandlerErrorMiddleware.handler);
  }

  private setup(): void {
    initAppSettings(config);
  }

  public listen(): HttpServer {
    const server = this.app.listen(config.server.Port, () => {
      logger.info({
        message: 'Server started',
        host: AppSettings.ServerHost,
        port: AppSettings.ServerPort,
        root: AppSettings.ServerRoot,
      });
    });

    return server;
  }

  private runServices(): HttpServer {
    return this.listen();
  }

  public start(): HttpServer {
    return this.runServices();
  }
}
