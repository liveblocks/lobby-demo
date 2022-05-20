import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../../lib/redis';

/**
 * Returns users count per room in the redis cache
 * This endpoint is used only for debugging purpose.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;
    const result = await redis.zrange(lobbyId, 0, -1, 'WITHSCORES');

    // Map roomId:number of users
    const rooms: Record<string, number> = {};

    for(let i = 0; i < result.length; i+=2) {
      rooms[result[i]] = Number.parseInt(result[i+1]);
    }

    res.status(200).json({ rooms });
};

export default handler;
