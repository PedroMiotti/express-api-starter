import type { ISampleService } from '../ISampleService';
import type { SampleServicePayload } from '../types';

export class LocalSampleService implements ISampleService {
  async getBaseSample(): Promise<SampleServicePayload> {
    return {
      id: 'sample-local-id',
      source: 'local',
      value: 'sample-service-value',
      createdAt: new Date().toISOString(),
    };
  }
}
