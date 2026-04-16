export class RepositoryError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}
