'use client'

import {
    Box,
    Center,
    Heading,
    Grid,
    Stack,
    Image,
    useColorModeValue,
    Spinner,
} from '@chakra-ui/react'
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { setAuthOptions } from "@components/setAuthOptions";
import type { SpotifyPlaylistItems } from '@custom-types/spotifyAPI';
import { getCookie } from 'cookies-next'
import { NavBar } from '@components/NavBar';
import { Footer } from '@components/Footer';
import { BACKGROUND_DARK, BACKGROUND_LIGHT } from '@definitions/constants';

const Playlists = () => {
    const access_token = getCookie('spotifyAccessToken');
    const router = useRouter();
    const [playlists, setPlaylists] = useState<SpotifyPlaylistItems[]>([]);
    const [isLoading, setLoading] = useState(true);
    const background = useColorModeValue(BACKGROUND_LIGHT, BACKGROUND_DARK);
    useEffect(() => {
        axios(setAuthOptions(access_token, 'https://api.spotify.com/v1/me')).then((response: AxiosResponse) => {
            axios(setAuthOptions(access_token, `https://api.spotify.com/v1/users/${response.data.id}/playlists`)).then((response: AxiosResponse) => {
                setPlaylists(response.data.items);
                setLoading(false);
            }).catch((error: AxiosError) => {
                console.log(error);
            });
        }).catch((error: AxiosError) => {
            console.log(error);
            router.push("/");
        });
    }, [access_token, router]);
    if (isLoading) {
        return (
            <Box width={"100%"} height={"100%"} pt="50vh">
                <Center>
                    <Spinner />
                </Center>
            </Box >
        )
    }
    return (
        <>
            <NavBar />
            <Grid templateColumns='repeat(3, 1fr)' gap={3} pt={"2vh"} pb={"2vh"}>
                {
                    playlists.map((playlist) => (
                        <Center py={12} key={playlist.id}>
                            <Box
                                role={'group'}
                                p={6}
                                maxW={'330px'}
                                w={'full'}
                                bg={background}
                                boxShadow={'2xl'}
                                rounded={'lg'}
                                pos={'relative'}
                                onClick={() => { router.push('/playlists/' + playlist.id) }}
                            >
                                <Box
                                    rounded={'lg'}
                                    mt={-12}
                                    pos={'relative'}
                                    height={'230px'}
                                    _after={{
                                        transition: 'all .3s ease',
                                        content: '""',
                                        w: 'full',
                                        h: 'full',
                                        pos: 'absolute',
                                        top: 5,
                                        left: 0,
                                        backgroundImage: `${playlist.images[0].url}`,
                                        filter: 'blur(15px)',
                                        zIndex: -1,
                                    }}
                                    _groupHover={{
                                        _after: {
                                            filter: 'blur(20px)',
                                        },
                                    }}>
                                    <Image
                                        rounded={'lg'}
                                        height={230}
                                        width={282}
                                        objectFit={'cover'}
                                        src={playlist.images[0].url}
                                        alt="#"
                                    />
                                </Box>
                                <Stack pt={10} align={'center'}>
                                    <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                                        {playlist.name}
                                    </Heading>
                                </Stack>
                            </Box>
                        </Center>
                    ))
                }
            </Grid>
            <Footer />
        </>

    );
}
export default Playlists;