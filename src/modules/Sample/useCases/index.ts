import { sampleProvider } from '@/shared/providers/SampleProvider';
import { sampleService } from '@/shared/services/SampleService';
import { PrismaSampleRepository } from '../repository';
import { GetPrivateSampleUseCase } from './GetPrivateSample';
import { GetSampleUseCase } from './GetSample';

const sampleRepository = new PrismaSampleRepository();

export const getSampleUseCase = new GetSampleUseCase(
  sampleService,
  sampleProvider,
  sampleRepository,
);

export const getPrivateSampleUseCase = new GetPrivateSampleUseCase(
  sampleService,
  sampleProvider,
  sampleRepository,
);
