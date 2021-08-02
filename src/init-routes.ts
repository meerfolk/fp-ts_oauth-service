import { FastifyInstance, RequestGenericInterface } from 'fastify';
import { pipe } from 'fp-ts/function';

import { IContext } from './domain/context.interface';

interface IOauthRedirectRequest extends RequestGenericInterface {
    Querystring: {
        code: string;
        state?: Record<string, string>;
    };
}

const addRedirectRoute =
    (context: IContext) =>
    (fastify: FastifyInstance) => {
        fastify.get<IOauthRedirectRequest, unknown>(
            '/v1/oauth-redirect/:oauthType',
            async (request) => {
                context.logInfo(request.query.code)();

                return {};
            }
        );

        return fastify;
    };

export const initRoutes = pipe(addRedirectRoute);
