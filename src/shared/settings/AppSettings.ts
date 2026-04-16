import type { AppConfig } from '@/infra/config';

type SettingsState = {
  Environment: string;
  ServerPort: string;
  ServerHost: string;
  ServerOrigins: string;
  ServerRoot: string;
};

const appSettings: SettingsState = {
  Environment: '',
  ServerPort: '',
  ServerHost: '',
  ServerOrigins: '',
  ServerRoot: '',
};

export const initAppSettings = (config: AppConfig): void => {
  appSettings.Environment = config.Environment;
  appSettings.ServerPort = String(config.server.Port);
  appSettings.ServerHost = config.server.Host;
  appSettings.ServerRoot = config.server.Root;
  appSettings.ServerOrigins = config.server.Origins;
};

export default appSettings;
