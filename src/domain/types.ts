import * as E from 'fp-ts/Either';

export type getConfigDataType = <T>(path: string) => E.Either<Error, T>;
