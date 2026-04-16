import type { ISampleProvider } from '../ISampleProvider';

export class LocalSampleProvider implements ISampleProvider {
  decorateValue(value: string): string {
    return `decorated:${value}`;
  }

  buildTraceId(prefix = 'sample'): string {
    return `${prefix}-${Date.now()}`;
  }
}
