export interface ISampleProvider {
  decorateValue(value: string): string;
  buildTraceId(prefix?: string): string;
}
