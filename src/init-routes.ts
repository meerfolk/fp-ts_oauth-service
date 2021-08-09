import { FastifyInstance, RequestGenericInterface } from 'fastify';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { IContext } from './domain/context.interface';
import { exchangeCode } from './domain/exchange-code';
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

const addRedirectRoute = (context: IContext) => (fastify: FastifyInstance) => {
    fastify.get<IOauthRedirectRequest, unknown>('/v1/oauth-redirect/:oauthType', async (request) => {
        return pipe(
            exchangeCode(context)(request.params.oauthType)(request.query.code),
            TE.fold(
                () => {
                    throw new Error('Something goes wrong');
                },
                (result) => async () => result,
            ),
        )();
    });

    return fastify;
};

export const initRoutes = pipe(addRedirectRoute);
