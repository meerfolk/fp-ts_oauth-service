import { FastifyInstance } from 'fastify';
import { container, DependencyContainer } from 'tsyringe';

import { IHttpClient, ILogger, getConfigDataType } from './domain';
import { exchangeCode, ExchangeCodeHandler } from './domain/exchange-code';
import { postHttpRequest, getConfigData } from './infrastructure';
import { OauthTypesEnum } from './domain/oauth';

export const initDI = (app: FastifyInstance): FastifyInstance => {
    container.register('logger', {
        useFactory: (): ILogger => ({
            logError: (message: string) => () => app.log.error(message),
            logInfo: (message: string) => () => app.log.info(message),
        }),
    });
    container.register('httpClient', {
        useFactory: (): IHttpClient => ({
            postRequest: postHttpRequest,
        }),
    });
    container.register('getConfigData', {
        useFactory: (): getConfigDataType => {
            return getConfigData;
        },
    });
    container.register('exchangeCode', {
        useFactory: (container: DependencyContainer): ((oauthType: OauthTypesEnum) => ExchangeCodeHandler) => {
            const logger = container.resolve<ILogger>('logger');
            const httpClient = container.resolve<IHttpClient>('httpClient');

            return exchangeCode(logger, httpClient, getConfigData);
        },
    });

    return app;
};
