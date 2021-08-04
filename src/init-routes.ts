import { FastifyInstance, RequestGenericInterface } from 'fastify';
import { pipe } from 'fp-ts/function';

import { IContext } from './domain/context.interface';
import { exchangeCode } from './domain/exchange-code';
import { OauthTypesEnum } from './domain/oauth/oauth-types-enum';

interface IOauthRedirectRequest extends RequestGenericInterface {
    Querystring: {
        code: string;
        state?: Record<string, string>;
    };
    Params: {
        oauthType: OauthTypesEnum;
    };
}

const addRedirectRoute =
    (context: IContext) =>
    (fastify: FastifyInstance) => {
        fastify.get<IOauthRedirectRequest, unknown>(
            '/v1/oauth-redirect/:oauthType',
            async (request) => {
                const exchange = exchangeCode(context)(request.params.oauthType)(request.query.code);

                return exchange();
            }
        );

        return fastify;
    };

export const initRoutes = pipe(addRedirectRoute);
