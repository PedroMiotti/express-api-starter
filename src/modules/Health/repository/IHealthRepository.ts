export interface IHealthRepository {
  pingDatabase(): Promise<void>;
}
