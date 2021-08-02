import * as E from 'fp-ts/Either';
import * as IO from 'fp-ts/IO';

export interface IContext {
    getConfigData: <T>(path: string) => E.Either<Error, T>;
    logInfo: (message: string) => IO.IO<void>;
}
