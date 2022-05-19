import Layout from '../components/Layout';
import { createClient } from '@liveblocks/client';
import { getBgColorForRoom } from '../utils';
import { LiveblocksProvider, useRoom, RoomProvider } from '@liveblocks/react';

const client = createClient({ publicApiKey: 'pk_live_Sf45D7fVoAF-LS1W147UpWin' });

function initialPresence(roomId: string) {
    return {
        bg: getBgColorForRoom(roomId),
        cursor: { x: 0, y: 0 },
    };
}

function CursorsPage() {
    const room = useRoom();
    return (
        <Layout title="Sheet">
            Hi there, you're in room <strong>{room.id}</strong>!
        </Layout>
    );
}

const StaticPropsDetail = () => {
    return (
        <LiveblocksProvider client={client}>
            <RoomProvider id="conference-demo" initialPresence={initialPresence}>
                <CursorsPage />
            </RoomProvider>
        </LiveblocksProvider>
    );
};

export default StaticPropsDetail;
