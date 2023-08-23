'use client'

import { Box, Center, Button } from '@chakra-ui/react'
import queryString from 'query-string';

const spotifyClientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectURI = process.env.NEXT_PUBLIC_HOST;

const LandingPage = () => {
  const generateRandomString = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 16) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  const handleClick = () => {
    const authUrl = 'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: spotifyClientID,
        scope: 'user-read-private user-read-email playlist-read-private',
        redirect_uri: redirectURI + "/callback",
        state: generateRandomString()
      });
    window.location.href = authUrl;
  }
  return (
    <Box width={"100%"} height={"100%"} pt="50vh">
      <Center>
        <Button onClick={() => handleClick()}>Login Spotify</Button>
      </Center>
    </Box >
  );
}
export default LandingPage;