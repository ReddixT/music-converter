'use client'

import { useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import axios, { AxiosError, AxiosResponse } from "axios";
import * as querystring from 'querystring';
import { setCookie } from "cookies-next";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { SpotifyResponse } from "@custom-types/spotifyAPI";
const Callback: React.FC = () => {
    const router = useRouter();
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const host = process.env.NEXT_PUBLIC_HOST;
    const code = useSearchParams().get('code');
    const state = useSearchParams().get('state');
    useEffect(() => {
        if (state === null) {
            router.push('/#' + querystring.stringify({ error: 'state_mismatch' }));
        }
        axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                code: code,
                redirect_uri: host + '/callback',
                grant_type: 'authorization_code'
            }),
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response: AxiosResponse<SpotifyResponse>) => {
            setCookie('spotifyAccessToken', response.data.access_token);
            router.push(host + '/playlists');
        }).catch((error: AxiosError) => {
            console.log({ 'message': error.response?.data });
        });
    })

    return (
        <>
            <Box width={"100%"} height={"100%"} pt="50vh">
                <Center>
                    <Spinner />
                </Center>
            </Box>
        </>
    )
}
export default Callback;