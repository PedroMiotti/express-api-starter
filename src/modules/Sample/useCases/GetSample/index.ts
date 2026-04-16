import { RepositoryError } from '@/shared/error/RepositoryError';
import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';
import { type IResult, Result } from '@/shared/http/Result';
import type { ISampleProvider } from '@/shared/providers/SampleProvider';
import type { ISampleService } from '@/shared/services/SampleService';
import type { SampleResponseDto } from '../../dto';
import type { ISampleRepository } from '../../repository';

export class GetSampleUseCase {
  constructor(
    private readonly sampleService: ISampleService,
    private readonly sampleProvider: ISampleProvider,
    private readonly sampleRepository: ISampleRepository,
  ) {}

  async execute(): Promise<IResult<SampleResponseDto>> {
    const result = new Result<SampleResponseDto>();
    try {
      const servicePayload = await this.sampleService.getBaseSample();
      const sampleRecord = await this.sampleRepository.findById(
        servicePayload.id,
      );

      result.setData(
        {
          message: `Sample module using shared service and provider (${sampleRecord?.name ?? 'fallback-repository'})`,
          traceId: this.sampleProvider.buildTraceId('sample'),
          decoratedValue: this.sampleProvider.decorateValue(
            servicePayload.value,
          ),
          servicePayload,
        },
        ApplicationStatusCodes.SUCCESS,
        'Sample response generated',
      );
    } catch (error: unknown) {
      throw new RepositoryError(
        'Could not load sample response dependencies.',
        error,
      );
    }

    return result;
  }
}
