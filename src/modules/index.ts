import type BaseController from '@/shared/base/BaseController';
import HealthController from './Health/Health.controller';
import SampleController from './Sample/Sample.controller';

export const controllers: BaseController[] = [
  HealthController,
  SampleController,
];
