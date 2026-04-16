import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';
import { type IResult, Result } from '@/shared/http/Result';
import type { ISampleProvider } from '@/shared/providers/SampleProvider';
import type { ISampleService } from '@/shared/services/SampleService';
import type { SampleResponseDto } from '../../dto';

export class GetSampleUseCase {
  constructor(
    private readonly sampleService: ISampleService,
    private readonly sampleProvider: ISampleProvider,
  ) {}

  async execute(): Promise<IResult<SampleResponseDto>> {
    const result = new Result<SampleResponseDto>();
    const servicePayload = await this.sampleService.getBaseSample();

    result.setData(
      {
        message: 'Sample module using shared service and provider',
        traceId: this.sampleProvider.buildTraceId('sample'),
        decoratedValue: this.sampleProvider.decorateValue(servicePayload.value),
        servicePayload,
      },
      ApplicationStatusCodes.SUCCESS,
      'Sample response generated',
    );

    return result;
  }
}
