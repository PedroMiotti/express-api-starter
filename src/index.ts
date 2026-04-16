import * as dotenv from 'dotenv';

dotenv.config();

if (
  process.env.IS_MONITORING_ENABLED === 'true' &&
  process.env.ENVIRONMENT === 'production'
) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  require('newrelic');
}

import 'module-alias/register';

import App from '@/infra/server/App';
import { controllers } from './modules';

const app = new App(controllers);

app.start();
