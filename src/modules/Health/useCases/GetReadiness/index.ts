import type { IShutdownState } from '@/infra/server/shutdown/state';
import type {
  GetReadinessBody,
  GetReadinessOutput,
  ReadinessCheckDetail,
  ReadinessChecks,
} from '@/modules/Health/dto';
import type { IHealthRepository } from '@/modules/Health/repository';

const READINESS_DATABASE_CHECK_TIMEOUT_MS = 2000;

const checkErrorDetail = (error: unknown): string =>
  error instanceof Error ? error.message : 'unknown_error';

export class GetReadinessUseCase {
  constructor(
    private readonly shutdownReadiness: IShutdownState,
    private readonly healthRepository: IHealthRepository,
    private readonly releaseMeta: {
      appVersion: string | undefined;
      gitCommit: string | undefined;
    },
  ) {}

  async execute(): Promise<GetReadinessOutput> {
    const checks: ReadinessChecks = {};
    const shutdownOk = this.shutdownReadiness.isReady();
    checks.shutdown = shutdownOk
      ? { status: 'ok' }
      : { status: 'error', detail: 'shutting_down' };

    if (!shutdownOk) {
      return this.buildResponse(checks, false);
    }

    checks.database = await this.runDatabaseCheck();

    const allOk = Object.values(checks).every((c) => c.status === 'ok');
    return this.buildResponse(checks, allOk);
  }

  private buildResponse(
    checks: ReadinessChecks,
    allOk: boolean,
  ): GetReadinessOutput {
    const body: GetReadinessBody = {
      status: allOk ? 'ready' : 'not_ready',
      checks,
    };

    if (this.releaseMeta.appVersion) {
      body.version = this.releaseMeta.appVersion;
    }

    if (this.releaseMeta.gitCommit) {
      body.commit = this.releaseMeta.gitCommit;
    }

    return {
      httpStatus: allOk ? 200 : 503,
      body,
    };
  }

  private async runDatabaseCheck(): Promise<ReadinessCheckDetail> {
    const started = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('database_ping_timeout'));
        }, READINESS_DATABASE_CHECK_TIMEOUT_MS);
      });
      await Promise.race([
        this.healthRepository.pingDatabase(),
        timeoutPromise,
      ]);
      return { status: 'ok', latencyMs: Date.now() - started };
    } catch (error: unknown) {
      return {
        status: 'error',
        latencyMs: Date.now() - started,
        detail: checkErrorDetail(error),
      };
    } finally {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    }
  }
}
