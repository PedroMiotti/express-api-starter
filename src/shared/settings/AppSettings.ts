import type { AppConfig } from '@/infra/config';

type SettingsState = {
  Environment: string;
  ServerPort: string;
  ServerHost: string;
  ServerOrigins: string;
  ServerRoot: string;
  HealthAppVersion: string | undefined;
  HealthGitCommit: string | undefined;
};

const appSettings: SettingsState = {
  Environment: '',
  ServerPort: '',
  ServerHost: '',
  ServerOrigins: '',
  ServerRoot: '',
  HealthAppVersion: undefined,
  HealthGitCommit: undefined,
};

export const initAppSettings = (config: AppConfig): void => {
  appSettings.Environment = config.Environment;
  appSettings.ServerPort = String(config.server.Port);
  appSettings.ServerHost = config.server.Host;
  appSettings.ServerRoot = config.server.Root;
  appSettings.ServerOrigins = config.server.Origins;
  appSettings.HealthAppVersion = config.health.appVersion;
  appSettings.HealthGitCommit = config.health.gitCommit;
};

export default appSettings;
