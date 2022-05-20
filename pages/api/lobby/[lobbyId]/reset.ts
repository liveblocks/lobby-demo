import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../../lib/redis';

/**
 * Reset redis cache
 * This endpoint is only used for debugging purpose
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;
    await redis.del(lobbyId);
    res.status(200).json({ ok: true });
};

export default handler;
