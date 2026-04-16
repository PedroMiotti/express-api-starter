/**
 * No-op monitoring facade. Replace with your APM / metrics provider later.
 * Stable call sites: noticeError, recordCustomEvent, recordMetric.
 */
export const monitoring = {
  noticeError(_error: Error, _context?: Record<string, unknown>): void {
    /* intentionally empty */
  },

  recordCustomEvent(
    _eventType: string,
    _attributes?: Record<string, unknown>,
  ): void {
    /* intentionally empty */
  },

  recordMetric(_name: string, _value: number): void {
    /* intentionally empty */
  },
};
