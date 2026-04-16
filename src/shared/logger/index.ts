import dotenv from 'dotenv';
import type { Logger } from 'winston';
import buildDevLogger from './logger.dev';
import buildProdLogger from './logger.prod';

dotenv.config();

let logger: Logger;
const isDevEnvironment = process.env.ENVIRONMENT === 'development';

if (isDevEnvironment) logger = buildDevLogger;
else logger = buildProdLogger;

export default logger;
