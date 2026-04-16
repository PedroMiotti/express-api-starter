import type { SampleServicePayload } from '@/shared/services/SampleService';

export type SampleResponseDto = {
  message: string;
  traceId: string;
  decoratedValue: string;
  servicePayload: SampleServicePayload;
};
