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
 * NOTE: This API may eventually be shipped as part of @liveblocks/react.
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
            /* no await */ fetch(`/api/lobby/${lobbyId}/${roomId}/entered`);

            // NOTE: Explicitly telling our API (and thus Redis) that a user
            // left can be unreliable. It works if this component is unmounted
            // in the React way, but not if a user closes a browser tab,
            // because that will not trigger an unmount. Also, browsers may not
            // get a chance to send any HTTP requests anymore anyway. To make
            // this more resilient, you may need to periodically poll the
            // /api/rooms/:roomId/users endpoint and pull active user counts
            // from there.
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
