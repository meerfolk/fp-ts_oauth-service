import * as TE from 'fp-ts/TaskEither';
import * as IO from 'fp-ts/IO';

import { getConfigDataType } from './types';

export interface IHttpClient {
    postRequest: <T>(url: string, params: Record<string, string>) => TE.TaskEither<Error, T>;
}

export interface ILogger {
    logInfo: (message: string) => IO.IO<void>;
    logError: (message: string) => IO.IO<void>;
}

export interface IContext {
    getConfigData: getConfigDataType;
    logger: ILogger;
    httpClient: IHttpClient;
}
