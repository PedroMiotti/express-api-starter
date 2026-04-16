import { sampleProvider } from '@/shared/providers/SampleProvider';
import { sampleService } from '@/shared/services/SampleService';
import { GetPrivateSampleUseCase } from './GetPrivateSample';
import { GetSampleUseCase } from './GetSample';

export const getSampleUseCase = new GetSampleUseCase(
  sampleService,
  sampleProvider,
);

export const getPrivateSampleUseCase = new GetPrivateSampleUseCase(
  sampleService,
  sampleProvider,
);
