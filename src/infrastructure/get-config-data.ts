import * as config from 'config';
import * as E from 'fp-ts/Either';

export const getConfigData = <T>(path: string): E.Either<Error, T> => {
   return E.tryCatch(
       () => {
          return config.get<T>(path);
       },
       (error) => error as Error,
   )
}
