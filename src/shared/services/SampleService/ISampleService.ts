import type { SampleServicePayload } from './types';

export interface ISampleService {
  getBaseSample(): Promise<SampleServicePayload>;
}
