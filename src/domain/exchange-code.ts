import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';

import { ILogger, IHttpClient } from './context.interface';
import { OauthTypesEnum, oauthGoogle } from './oauth';
import { getConfigDataType } from './types';

export type ExchangeCodeHandler = (code: string) => ExchangeCodeTaskEither;
export type ExchangeCodeTaskEither = TE.TaskEither<Error, Record<string, string>>;

const getGooglePipe = (
    logger: ILogger,
    httpClient: IHttpClient,
    getConfigData: getConfigDataType,
): E.Either<Error, ExchangeCodeHandler> =>
    pipe(
        getConfigData<string>('client.redirect'),
        E.bindTo('redirectUri'),
        E.bind('clientId', () => getConfigData<string>('client.id')),
        E.bind('clientSecret', () => getConfigData<string>('client.secret')),
        E.map(({ redirectUri, clientId, clientSecret }) =>
            oauthGoogle(httpClient, clientId, clientSecret, redirectUri),
        ),
    );

const getPipe =
    (logger: ILogger, httpClient: IHttpClient, getConfigData: getConfigDataType) =>
    (oauthType: OauthTypesEnum): E.Either<Error, ExchangeCodeHandler> => {
        switch (oauthType) {
            case OauthTypesEnum.GOOGLE:
                return getGooglePipe(logger, httpClient, getConfigData);
            default:
                return E.left(new Error('Wrong oauth type'));
        }
    };

export const exchangeCode =
    (logger: ILogger, httpClient: IHttpClient, getConfigData: getConfigDataType) =>
    (oauthType: OauthTypesEnum) =>
    (code: string): ExchangeCodeTaskEither => {
        return pipe(
            getPipe(logger, httpClient, getConfigData)(oauthType),
            TE.fromEither,
            TE.chain((flow) => flow(code)),
        );
    };
