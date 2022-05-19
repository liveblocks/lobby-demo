import * as React from 'react';
import { RoomProvider } from '@liveblocks/react';
import { useAsync } from 'react-async-hook';

type LobbyProviderProps<TPresence> = {
    lobbyId: string;
    children: React.ReactNode;
    fallback?: JSX.Element;
    initialPresence?: TPresence | ((roomId: string) => TPresence);
};

async function fetcher(lobbyId: string): Promise<string> {
    const res = await fetch(`/api/lobby/${lobbyId}`);
    const data = await res.json();
    return data.roomId as string;
}

/**
 * Makes a Room available in the component hierarchy below.
 * When this component is unmounted, the current user leave the room.
 * That means that you can't have 2 RoomProvider with the same room id in your react tree.
 */
export default function LobbyProvider<TStorage extends Record<string, unknown>>(
    props: LobbyProviderProps<TStorage>,
): JSX.Element | null {
    const { lobbyId, initialPresence } = props;
    const roomIdResult = useAsync(fetcher, [lobbyId]);

    const roomId = roomIdResult.result;
    const sent = React.useRef(false);

    React.useEffect(() => {
        console.log({ lobbyId, roomId });
        if (roomId) {
            window.addEventListener('beforeunload', () => {
                if (!sent.current) {
                    sent.current = true;
                    /* no await */ fetch(`/api/lobby/${lobbyId}/${roomId}/left`);
                }
            });

            /* no await */ fetch(`/api/lobby/${lobbyId}/${roomId}/entered`);

            return () => {
                if (!sent.current) {
                    sent.current = true;
                    /* no await */ fetch(`/api/lobby/${lobbyId}/${roomId}/left`);
                }
            };
        }
    }, [roomId ?? null]);

    if (roomIdResult.result) {
        return (
            <RoomProvider id={roomIdResult.result} initialPresence={initialPresence}>
                {props.children}
            </RoomProvider>
        );
    } else if (roomIdResult.loading) {
        return props.fallback ?? null;
    } else {
        return <div>Could not be seated! :(</div>;
    }
}
