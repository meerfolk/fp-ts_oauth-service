import { flow, Lazy } from 'fp-ts/function';

import { IContext } from './context.interface';
import { OauthTypesEnum } from './oauth/oauth-types-enum';

export const exchangeCode =
    (context: IContext) =>
    (oauthType: OauthTypesEnum) =>
    (code: string): Lazy<Record<string, string>> => {
        const logOauthType = context.logInfo(oauthType);
        const logCode = context.logInfo(code);

        return flow(logOauthType, logCode, () => ({}));
    };
