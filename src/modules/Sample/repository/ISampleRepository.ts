export type SampleRepositoryEntity = {
  id: string;
  name: string;
  createdAt: Date;
};

export interface ISampleRepository {
  findById(id: string): Promise<SampleRepositoryEntity | null>;
}
