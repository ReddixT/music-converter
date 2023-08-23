'use client'

import { Flex, Box, Text, Image, Center, useColorModeValue, Heading, Spinner } from "@chakra-ui/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import type { SpotifyPlaylistItem, SpotifyPlaylistSongItem } from "@custom-types/spotifyAPI";
import { getCookie } from "cookies-next";
import { setAuthOptions } from "@components/setAuthOptions";
import { NavBar } from "@components/NavBar";
import { Footer } from "@components/Footer";
import { BACKGROUND_DARK, BACKGROUND_LIGHT } from "@definitions/constants";

const PlaylistSongs = () => {
    const router = useRouter()
    const access_token = getCookie('spotifyAccessToken');
    const playlistid = usePathname().split('/').pop();
    const [playlistSongs, setPlaylistSongs] = useState<SpotifyPlaylistSongItem[]>([]);
    const [playlistInfo, setPlaylistInfo] = useState<SpotifyPlaylistItem>()
    const [isLoading, setLoading] = useState(true);

    const background = useColorModeValue(BACKGROUND_LIGHT, BACKGROUND_DARK);
    useEffect(() => {
        const fetchSongs = (offset = 0) => {
            axios(setAuthOptions(access_token, `https://api.spotify.com/v1/playlists/${playlistid}/tracks?offset=${offset}`)).then((response: AxiosResponse) => {
                setPlaylistSongs(prevSongs => [...prevSongs, ...response.data.items]);
                if (response.data.items.length === 100) {
                    fetchSongs(offset + 100);
                }
            }).catch((error: AxiosError) => {
                console.log(error);
                router.push("/");
            });
        }
        fetchSongs();
        axios(setAuthOptions(access_token, `https://api.spotify.com/v1/playlists/${playlistid}`)).then((response: AxiosResponse) => {
            setPlaylistInfo(response.data);
            setLoading(false);
        }).catch((error: AxiosError) => {
            console.log(error);
            router.push("/")
        });
    }, [access_token, playlistid, router])
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
            <Box pt="2vh" pb="2vh">
                {
                    playlistInfo &&
                    <Center>
                        <Flex p="1vh" m="1vh" mb="2vh" backgroundColor={background} width="70%" borderRadius={"10px"}>
                            <Image src={playlistInfo.images[0].url} m="2vh" boxSize={"10vw"} borderRadius={"10px"} alt="#" />
                            <Flex flexDir={"column"} mt="2vh">
                                <Heading size='2xl' mb="1vh" >{playlistInfo.name}</Heading>
                                <Heading size='md' mb="3vh" >{playlistInfo.owner.display_name}</Heading>
                                <Text>{playlistInfo.description}</Text>
                            </Flex>
                        </Flex>
                    </Center>
                }
                {
                    playlistSongs.map((song) => {
                        return (
                            <Center key={song.track.id}>
                                <Flex
                                    width="50%"
                                    mb="1vh"
                                    height="7vh"
                                    background={background}
                                    borderRadius={"5px"}
                                >
                                    <Image src={song.track.album.images[2].url} alt="#" pr="1vh" borderRadius={"5px"} />
                                    <Flex flexDir={"column"} flex={"1"} alignSelf={"center"}>
                                        <Text>{song.track.name}</Text>
                                        <Text>{song.track.artists[0].name}</Text>
                                    </Flex>

                                </Flex>
                            </Center>
                        )
                    })
                }
            </Box>
            <Footer />
        </>
    );
}
export default PlaylistSongs;