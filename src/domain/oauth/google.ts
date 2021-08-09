import * as TE from 'fp-ts/TaskEither';

import { IHttpClient } from '../context.interface';

const URL = 'https://oauth2.googleapis.com/_token';
const params = {
    grant_type: 'authorization_code',
};

interface IGoogleOauthResponse extends Record<string, string> {}

export const oauthGoogle =
    (httpClient: IHttpClient, clientId: string, clientSecret: string, redirectUri: string) =>
    (code: string): TE.TaskEither<Error, IGoogleOauthResponse> => {
        return httpClient.postRequest<IGoogleOauthResponse>(URL, {
            ...params,
            client_id: clientId,
            redirect_uri: redirectUri,
            client_secret: clientSecret,
            code,
        });
    };
