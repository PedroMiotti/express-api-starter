import type {
  ISampleRepository,
  SampleRepositoryEntity,
} from '../ISampleRepository';

export class PrismaSampleRepository implements ISampleRepository {
  async findById(id: string): Promise<SampleRepositoryEntity | null> {
    return {
      id,
      name: 'sample-prisma-repository',
      createdAt: new Date(),
    };
  }
}
