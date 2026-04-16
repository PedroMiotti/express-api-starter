import { sampleProvider } from '@/shared/providers/SampleProvider';
import { sampleService } from '@/shared/services/SampleService';
import { GetSampleUseCase } from './GetSample';

export const getSampleUseCase = new GetSampleUseCase(
  sampleService,
  sampleProvider,
);
