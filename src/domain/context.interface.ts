import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as IO from 'fp-ts/IO';

export interface IHttpClient {
    postRequest: <T>(url: string, params: Record<string, string>) => TE.TaskEither<Error, T>;
}

export interface ILogger {
    logInfo: (message: string) => IO.IO<void>;
    logError: (message: string) => IO.IO<void>;
}

export interface IContext {
    getConfigData: <T>(path: string) => E.Either<Error, T>;
    logger: ILogger;
    httpClient: IHttpClient;
}
