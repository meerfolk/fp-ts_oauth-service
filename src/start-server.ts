import { FastifyInstance } from 'fastify';
import * as TE from 'fp-ts/TaskEither';
import * as F from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import { IContext } from './domain/context.interface';

export const startServer =
    (context: IContext) =>
    (app: FastifyInstance): TE.TaskEither<Error, void> => {
        const start = F.pipe(
            context.getConfigData<number>('server.port'),
            E.map(async (port) => { await app.listen(port) }),
            E.foldW(
                (error: Error) => { throw error },
                (result: Promise<void>) => result,
            ),
        );

        return TE.tryCatch(
            () => start,
            (reason) => new Error(String(reason)),
        );
    }
