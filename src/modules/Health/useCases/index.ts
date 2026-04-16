import config from '@/infra/config';
import { shutdownState } from '@/infra/server/shutdown/state';
import { PrismaHealthRepository } from '../repository';
import { GetReadinessUseCase } from './GetReadiness';

const prismaHealthRepository = new PrismaHealthRepository();

export const getReadinessUseCase = new GetReadinessUseCase(
  shutdownState,
  prismaHealthRepository,
  {
    appVersion: config.health.appVersion,
    gitCommit: config.health.gitCommit,
  },
);
