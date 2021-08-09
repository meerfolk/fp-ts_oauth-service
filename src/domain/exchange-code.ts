import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';

import { IContext } from './context.interface';
import { OauthTypesEnum, oauthGoogle } from './oauth';

export type ExchangeCodeHandler = (code: string) => ExchangeCodeTaskEither;
export type ExchangeCodeTaskEither = TE.TaskEither<Error, Record<string, string>>;

const getGooglePipe = (context: IContext): E.Either<Error, ExchangeCodeHandler> => {
    return pipe(
        context.getConfigData<string>('client.redirect'),
        E.bindTo('redirectUri'),
        E.bind('clientId', () => context.getConfigData<string>('client.id')),
        E.bind('clientSecret', () => context.getConfigData<string>('client.secret')),
        E.map(({ redirectUri, clientId, clientSecret }) =>
            oauthGoogle(context.httpClient, clientId, clientSecret, redirectUri),
        ),
    );
};

const getPipe =
    (context: IContext) =>
    (oauthType: OauthTypesEnum): E.Either<Error, ExchangeCodeHandler> => {
        switch (oauthType) {
            case OauthTypesEnum.GOOGLE:
                return getGooglePipe(context);
            default:
                return E.left(new Error('Wrong oauth type'));
        }
    };

export const exchangeCode =
    (context: IContext) =>
    (oauthType: OauthTypesEnum) =>
    (code: string): ExchangeCodeTaskEither => {
        return pipe(
            getPipe(context)(oauthType),
            TE.fromEither,
            TE.chain((flow) => flow(code)),
        );
    };
