// import * as O from 'fp-ts/Option';
// import * as E from 'fp-ts/Either';
// import { flow } from 'fp-ts/function';
// import { decode as decodeJsonWebToken } from 'jsonwebtoken';
//
// import { ILogger } from '../domain/context.interface';
//
// const decode = (token: string): O.Option<string> => {
//     const decodedToken = decodeJsonWebToken(token);
//
//     if (decodedToken === null) {
//         return O.none;
//     }
//
//     return O.some(decodedToken.toString());
// };
//
// const parse =
//     (logger: ILogger) =>
//     (jwtString: string): E.Either<Error, Record<string, string>> => {
//         try {
//             const json = JSON.parse(jwtString);
//             return E.right(json);
//         } catch (error) {
//             logger.logError(error.message);
//
//             return E.left(new Error('JWT parsing failed'));
//         }
//     };
//
// export const decodeJwt = (logger: ILogger) =>
//     flow(
//         decode,
//         E.fromOption(() => new Error('JWT not decoded')),
//         E.chain(parse(logger)),
//     );
