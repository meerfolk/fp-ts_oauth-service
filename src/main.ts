import Fastify from 'fastify';
import { flow } from 'fp-ts/function';

import { initRoutes } from './init-routes';
import { startServer } from './start-server';
import { IContext } from './domain/context.interface';
import { getConfigData } from './infrastructure/get-config-data';

const app = Fastify({
    logger: true,
    disableRequestLogging: true,
});
const context: IContext = {
    getConfigData,
    logInfo: (message: string) => () => app.log.info(message),
};

flow(
    initRoutes(context),
    startServer(context),
)(app);
