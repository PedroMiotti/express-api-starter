export interface IShutdownState {
  markShuttingDown(): void;
  isReady(): boolean;
}

class ShutdownState implements IShutdownState {
  private shuttingDown = false;

  public markShuttingDown(): void {
    this.shuttingDown = true;
  }

  public isReady(): boolean {
    return !this.shuttingDown;
  }
}

export const shutdownState = new ShutdownState();
