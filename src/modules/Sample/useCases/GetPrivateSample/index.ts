import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';
import { type IResult, Result } from '@/shared/http/Result';
import type { ISampleProvider } from '@/shared/providers/SampleProvider';
import type { ISampleService } from '@/shared/services/SampleService';
import type { PrivateSampleResponseDto } from '../../dto';

export class GetPrivateSampleUseCase {
  constructor(
    private readonly sampleService: ISampleService,
    private readonly sampleProvider: ISampleProvider,
  ) {}

  async execute(input: {
    actorId: string;
    includeMeta: boolean;
  }): Promise<IResult<PrivateSampleResponseDto>> {
    const result = new Result<PrivateSampleResponseDto>();
    const servicePayload = await this.sampleService.getBaseSample();

    result.setData(
      {
        message: 'Authenticated sample route',
        traceId: this.sampleProvider.buildTraceId('sample-private'),
        decoratedValue: this.sampleProvider.decorateValue(servicePayload.value),
        servicePayload,
        actorId: input.actorId,
        includeMeta: input.includeMeta,
      },
      ApplicationStatusCodes.SUCCESS,
      'Private sample response generated',
    );

    return result;
  }
}
