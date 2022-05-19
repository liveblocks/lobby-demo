import { createClient } from '@liveblocks/client';
import Cursor from '../components/Cursor';
import { getBgColorForRoom } from '../utils';
import { LiveblocksProvider, useMyPresence, useOthers, useRoom } from '@liveblocks/react';

// NOTE: This API would eventually ship as part of @liveblocks/react
import LobbyProvider from '../components/LobbyRoomProvider';

const client = createClient({ publicApiKey: 'pk_live_Sf45D7fVoAF-LS1W147UpWin' });

type Cursor = {
    x: number;
    y: number;
};

type Presence = {
    cursor: Cursor | null;
};

const initialPresence: Presence = { cursor: null };

// Flying cursor colors
const COLORS = [
    '#E57373',
    '#9575CD',
    '#4FC3F7',
    '#81C784',
    '#FFF176',
    '#FF8A65',
    '#F06292',
    '#7986CB',
];

function CursorDemo() {
    const room = useRoom();

    /**
     * useMyPresence returns the presence of the current user and a function to update it.
     * updateMyPresence is different than the setState function returned by the useState hook from React.
     * You don't need to pass the full presence object to update it.
     * See https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence for more information
     */
    const [, updateMyPresence] = useMyPresence<Presence>();

    /**
     * Return all the other users in the room and their presence (a cursor position in this case)
     */
    const others = useOthers<Presence>();

    return (
        <main
            className="relative w-full h-screen flex place-content-center place-items-center"
            style={{ backgroundColor: getBgColorForRoom(room.id) }}
            onPointerMove={(event) =>
                // Update the user cursor position on every pointer move
                updateMyPresence({
                    cursor: {
                        x: Math.round(event.clientX),
                        y: Math.round(event.clientY),
                    },
                })
            }
            onPointerLeave={() =>
                // When the pointer goes out, set cursor to null
                updateMyPresence({
                    cursor: null,
                })
            }>
            <div className="max-w-sm h-32 text-center space-y-5">
                {others.count === 0 ? (
                    <p>You are currently alone in this room.</p>
                ) : (
                    <p>
                        You are in this room together with <strong>{others.count}</strong>{' '}
                        others. Move your cursor to say hi to them!
                    </p>
                )}
                <p className="text-sm">
                    You were auto-assigned to room{' '}
                    <code className="text-xs font-bold">{room.id}</code>.
                </p>
            </div>

            {
                /**
                 * Iterate over other users and display a cursor based on their presence
                 */
                others.map(({ connectionId, presence }) => {
                    if (presence == null || presence.cursor == null) {
                        return null;
                    }

                    return (
                        <Cursor
                            key={`cursor-${connectionId}`}
                            // connectionId is an integer that is incremented at every new connections
                            // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
                            color={COLORS[connectionId % COLORS.length]}
                            x={presence.cursor.x}
                            y={presence.cursor.y}
                        />
                    );
                })
            }
        </main>
    );
}

const StaticPropsDetail = () => {
    return (
        <LiveblocksProvider client={client}>
            {/*
                // Classic setup!
                <RoomProvider id="demo" initialPresence={initialPresence}>
                    <CursorDemo />
                </RoomProvider>
            */}
            <LobbyProvider lobbyId="demo" initialPresence={initialPresence}>
                <CursorDemo />
            </LobbyProvider>
        </LiveblocksProvider>
    );
};

export default StaticPropsDetail;
