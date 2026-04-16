import { RepositoryError } from '@/shared/error/RepositoryError';
import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';
import { type IResult, Result } from '@/shared/http/Result';
import type { ISampleProvider } from '@/shared/providers/SampleProvider';
import type { ISampleService } from '@/shared/services/SampleService';
import type { PrivateSampleResponseDto } from '../../dto';
import type { ISampleRepository } from '../../repository';

export class GetPrivateSampleUseCase {
  constructor(
    private readonly sampleService: ISampleService,
    private readonly sampleProvider: ISampleProvider,
    private readonly sampleRepository: ISampleRepository,
  ) {}

  async execute(input: {
    actorId: string;
    includeMeta: boolean;
  }): Promise<IResult<PrivateSampleResponseDto>> {
    const result = new Result<PrivateSampleResponseDto>();
    try {
      const servicePayload = await this.sampleService.getBaseSample();
      const sampleRecord = await this.sampleRepository.findById(
        servicePayload.id,
      );

      result.setData(
        {
          message: `Authenticated sample route (${sampleRecord?.name ?? 'fallback-repository'})`,
          traceId: this.sampleProvider.buildTraceId('sample-private'),
          decoratedValue: this.sampleProvider.decorateValue(
            servicePayload.value,
          ),
          servicePayload,
          actorId: input.actorId,
          includeMeta: input.includeMeta,
        },
        ApplicationStatusCodes.SUCCESS,
        'Private sample response generated',
      );
    } catch (error: unknown) {
      throw new RepositoryError(
        'Could not load private sample response dependencies.',
        error,
      );
    }

    return result;
  }
}
