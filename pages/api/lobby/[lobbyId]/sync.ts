import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../../lib/redis';

// Secret key coming from https://liveblocks.io/dashboard/apikeys
const SECRET_KEY = 'sk_live_PAXKggrM013G0d5wEN7memEc';

/**
 * Generate a JWT token with your Liveblock secret key to later fetch rooms users
 */
async function generateAuthToken() {
    const response = await fetch('https://liveblocks.io/api/authorize', {
        headers: {
            Authorization: `Bearer ${SECRET_KEY}`,
        },
    });

    const { token } = await response.json();
    return token;
}

/**
 * Get the number of users currently connected in the room
 */
async function getRoomsUserCount(roomId: string, jwtToken: string) {
    // This API is not documented on liveblocks.io
    const response = await fetch(`https://liveblocks.net/api/v1/room/${roomId}/users`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    });
    const result = await response.json();
    return result.data.length;
}

/**
 * Fetch lobbys rooms connected users and synchronize redis to fix discrepancies.
 * We recommend running this code in a cron job regularly instead of a Next API endpoint.
 * If there are too many rooms in the lobby, the lambda will probably timeout.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let jwtToken;
    try {
        jwtToken = await generateAuthToken();
    } catch (er) {
        console.error(er);
        return res
            .status(500)
            .json({ error: "Couldn't generate a Liveblocks JWT token" });
    }

    const lobbyId = req.query.lobbyId as string;
    const roomIds = await redis.zrange(lobbyId, 0, -1);

    for (const roomId of roomIds) {
        try {
            const count = await getRoomsUserCount(roomId, jwtToken);
            await redis.zadd(lobbyId, count, roomId);
        } catch (er) {
            console.log(er);
            // Silently catches error.
            // Redis cache will be synced during the next call
        }
    }

    res.status(200).json({ ok: true });
};

export default handler;
