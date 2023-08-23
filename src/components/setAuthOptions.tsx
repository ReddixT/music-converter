import { CookieValueTypes } from "cookies-next";

const setAuthOptions = (access_token: CookieValueTypes, url: string) => {
    return {
        method: 'get',
        url: url,
        headers: {
            'Authorization': 'Authorization: Bearer ' + access_token,
        }
    }
};

export { setAuthOptions };