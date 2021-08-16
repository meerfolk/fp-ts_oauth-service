import 'reflect-metadata';
import Fastify from 'fastify';
import { flow } from 'fp-ts/function';
import { container } from 'tsyringe';

import { initRoutes } from './init-routes';
import { startServer } from './start-server';
import { initDI } from './di-container';
import { ExchangeCodeHandler } from './domain/exchange-code';
import { getConfigDataType, ILogger } from './domain';

const app = Fastify({
    logger: true,
    disableRequestLogging: true,
});

initDI(app);

const logger = container.resolve<ILogger>('logger');
const exchangeCode = container.resolve<(oauthType: string) => ExchangeCodeHandler>('exchangeCode');
const getConfigData = container.resolve<getConfigDataType>('getConfigData');

flow(initRoutes(exchangeCode, logger), startServer(getConfigData))(app);
