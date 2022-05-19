import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import redis from '../../../../lib/redis';

function generateNewRoomId(lobbyId: string): string {
    return `${lobbyId}::${nanoid(12)}`;
}

const MAX_USERS_PER_ROOM = 3;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;

    //
    // NOTE:
    // This uses a Redis sorted set (ZSET) data structure that allows us to
    // keep counts of users in each room. When a user enters a room, the room
    // count is incremented by one, if they leave a room, it's decremented. See
    // the /api/lobby/[lobbyId]/[roomId]/{entered,left} endpoints for that
    // logic.
    //
    // For example, three people entering rooms would do:
    //
    //    ZINCRBY lobby-id 1 lobby-id::room-a
    //    ZINCRBY lobby-id 1 lobby-id::room-a
    //    ZINCRBY lobby-id 1 lobby-id::room-b
    //
    // After these commands, just to get an idea of what data gets stored with
    // this, you could get a full count overview with the following Redis
    // command:
    //
    //    ZRANGE lobby-id 0 -1 WITHSCORES
    //
    // Which would return data equivalent to this structure:
    //
    //    { "lobby-id::room-a": 2,
    //      "lobby-id::room-b": 1 }
    //
    // There are many ways to keep this count, with various trade-offs. This is
    // just one possible implementation.
    //
    // The quickest way to pull the preferred room to use from Redis is:
    //
    //    ZRANGE <lobby-id> 1 (MAX_USERS_PER_ROOM - 1) BYSCORE LIMIT 0 1
    //
    // This command selects the least occupied room from the list of known room
    // IDs that isn't already full.
    //
    const emptiest = await redis.zrange(
        lobbyId,
        1,
        MAX_USERS_PER_ROOM - 1,
        'BYSCORE',
        'LIMIT',
        0,
        1,
    );

    // Return the emptiest room, or a new one (if all rooms are full)
    const roomId = emptiest[0] ?? generateNewRoomId(lobbyId);
    res.status(200).json({ roomId });
};

export default handler;
