import { shutdownState } from '@/infra/server/shutdown/state';
import BaseController from '@/shared/base/BaseController';

class HealthController extends BaseController {
  constructor() {
    super('Health');
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/health/live', (_req, res) => {
      res.status(200).json({ status: 'alive' });
    });

    this.router.get('/health/ready', (_req, res) => {
      const ready = shutdownState.isReady();
      res.status(ready ? 200 : 503).json({
        status: ready ? 'ready' : 'not_ready',
      });
    });
  }
}

export default new HealthController();
