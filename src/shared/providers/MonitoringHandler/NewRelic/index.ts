type CustomAttributes = Record<string, string | number | boolean | undefined>;

interface NewRelicAgent {
  noticeError?(error: Error, customAttributes?: CustomAttributes): void;
  recordCustomEvent?(eventType: string, attributes?: CustomAttributes): void;
  recordMetric?(name: string, value: number): void;
}

function getAgent(): NewRelicAgent | null {
  if (process.env.IS_MONITORING_ENABLED !== 'true') {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require('newrelic') as NewRelicAgent;
  } catch {
    return null;
  }
}

export const monitoring = {
  noticeError(error: Error, context: Record<string, unknown>): void {
    const agent = getAgent();
    agent?.noticeError?.(error, context as CustomAttributes);
  },

  recordCustomEvent(
    eventType: string,
    attributes: Record<string, unknown>,
  ): void {
    const agent = getAgent();
    agent?.recordCustomEvent?.(eventType, attributes as CustomAttributes);
  },

  recordMetric(name: string, value: number): void {
    const agent = getAgent();
    agent?.recordMetric?.(name, value);
  },
};
