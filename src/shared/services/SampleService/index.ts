import { LocalSampleService } from './local';

export type { ISampleService } from './ISampleService';
export type { SampleServicePayload } from './types';

export const sampleService = new LocalSampleService();
