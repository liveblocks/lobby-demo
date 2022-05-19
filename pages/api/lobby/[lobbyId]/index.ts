import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import redis from '../../../../lib/redis';

function generateNewRoomId(lobbyId: string): string {
    return `${lobbyId}::${nanoid(12)}`;
}

const MAX_USERS_PER_ROOM = 3;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;

    // Pick at most one room [1], ordered from lowest to highest number of
    // active users [2], considering only the rooms between 1 and
    // MAX_USERS_PER_ROOM - 1 users [3]
    const emptiest = (
        await redis.zrange(
            lobbyId,

            // [3]
            1,
            MAX_USERS_PER_ROOM - 1,

            // [2]
            'BYSCORE',

            // [1]
            'LIMIT',
            0,
            1,
        )
    )[0];

    const roomId = emptiest ?? generateNewRoomId(lobbyId);

    res.status(200).json({
        roomId,
        full: await redis.zrange(lobbyId, 0, -1),
        debug: await redis.zrange(lobbyId, 0, -1, 'WITHSCORES'),
    });
};

export default handler;
