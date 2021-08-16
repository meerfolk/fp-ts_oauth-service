import { FastifyInstance, RequestGenericInterface } from 'fastify';
import { pipe, flow } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { ILogger } from './domain/context.interface';
import { ExchangeCodeHandler } from './domain/exchange-code';
import { OauthTypesEnum } from './domain/oauth';

interface IOauthRedirectRequest extends RequestGenericInterface {
    Querystring: {
        code: string;
        state?: Record<string, string>;
    };
    Params: {
        oauthType: OauthTypesEnum;
    };
}

const throwDefaultError = (): never => {
    throw new Error('Something goes wrong');
};

const getCommonFold = (logger: ILogger) =>
    TE.fold(
        (error: Error) => flow(logger.logError(error.message), throwDefaultError),
        (result) => async () => result,
    );

const addRedirectRoute =
    (exchangeCode: (oauthType: string) => ExchangeCodeHandler, logger: ILogger) =>
    (fastify: FastifyInstance): FastifyInstance => {
        fastify.get<IOauthRedirectRequest, unknown>('/v1/oauth-redirect/:oauthType', async (request) => {
            return pipe(exchangeCode(request.params.oauthType)(request.query.code), getCommonFold(logger))();
        });

        return fastify;
    };

export const initRoutes = (exchangeCode: (oauthType: string) => ExchangeCodeHandler, logger: ILogger) =>
    flow(addRedirectRoute(exchangeCode, logger));
