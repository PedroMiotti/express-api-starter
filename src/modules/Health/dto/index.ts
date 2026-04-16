export type ReadinessCheckStatus = 'ok' | 'error';

export type ReadinessCheckDetail = {
  status: ReadinessCheckStatus;
  latencyMs?: number;
  detail?: string;
};

export type ReadinessChecks = Record<string, ReadinessCheckDetail>;

export type GetReadinessBody = {
  status: 'ready' | 'not_ready';
  checks: ReadinessChecks;
  version?: string;
  commit?: string;
};

export type GetReadinessOutput = {
  httpStatus: 200 | 503;
  body: GetReadinessBody;
};
