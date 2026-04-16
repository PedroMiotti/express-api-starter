import * as dotenv from 'dotenv';

dotenv.config();

const dev = 'development';

export type AppConfig = {
  Environment: string;
  server: {
    Root: string;
    Host: string;
    Port: string | number;
    Origins: string;
  };
  monitoring: {
    enabled: boolean;
    licenseKey: string | undefined;
  };
  health: {
    appVersion: string | undefined;
    gitCommit: string | undefined;
  };
};

const config: AppConfig = {
  Environment: process.env.ENVIRONMENT || dev,
  server: {
    Root: process.env.SERVER_ROOT || '/api',
    Host: process.env.SERVER_HOST || 'localhost',
    Port: process.env.PORT || 5003,
    Origins:
      process.env.ORIGINS ||
      'http://localhost:3000,http://localhost:3001,http://localhost:3002',
  },
  monitoring: {
    enabled: process.env.IS_MONITORING_ENABLED === 'true',
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
  },
  health: {
    appVersion: process.env.APP_VERSION?.trim() || undefined,
    gitCommit: process.env.GIT_COMMIT?.trim() || undefined,
  },
};

export default config;
