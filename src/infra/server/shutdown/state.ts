class ShutdownState {
  private shuttingDown = false;

  public markShuttingDown(): void {
    this.shuttingDown = true;
  }

  public isReady(): boolean {
    return !this.shuttingDown;
  }
}

export const shutdownState = new ShutdownState();
