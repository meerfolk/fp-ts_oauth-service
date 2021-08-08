import * as TE from 'fp-ts/TaskEither';
import { request } from 'undici';
import { URL } from 'url';

const createUrl = (baseUrl: string, params: Record<string, string>): string => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    return url.toString();
};

const makeRequest = <T>(url: string): Promise<T> => {
    const options = {
        method: 'POST',
        maxRedirections: 10,
    };

    return request(url, options).then(async (response) => {
        if (response.statusCode !== 200) {
            throw new Error(`${await response.body.text()}`);
        }
        return response.body.json();
    });
};

export const postHttpRequest = <T>(url: string, params: Record<string, string>): TE.TaskEither<Error, T> => {
    return TE.tryCatch(
        () => makeRequest(createUrl(url, params)),
        (reason) => new Error(`${reason}`),
    );
};
