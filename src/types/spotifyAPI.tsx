type SpotifyPlaylistItem = {
    name: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[];
    id: string;
    owner: {
        display_name: string;
    };
    description: string;
};
type SpotifyPlaylistItems = {
    name: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[];
    id: string;
};
type SpotifyPlaylistSongItem = {
    track: {
        name: string;
        id: string;
        album: {
            images: {
                url: string;
            }[]
        }
        artists: {
            name: string;
        }[]
    }
}
type SpotifyResponse = {
    access_token: string;
};
export type {
    SpotifyPlaylistItem,
    SpotifyPlaylistItems,
    SpotifyPlaylistSongItem,
    SpotifyResponse
};