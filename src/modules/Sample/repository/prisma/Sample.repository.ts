import type {
  ISampleRepository,
  SampleRepositoryEntity,
} from '../ISampleRepository';

export class PrismaSampleRepository implements ISampleRepository {
  async findById(_id: string): Promise<SampleRepositoryEntity | null> {
    return null;
  }
}
