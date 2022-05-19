import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../../../lib/redis';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;
    const roomId = req.query.roomId as string;

    const results = await redis
        .multi()
        .zincrby(lobbyId, -1, roomId)
        .zremrangebyscore(lobbyId, '-inf', 0)
        .exec();
    res.status(200).json({ ok: true, results });
};

export default handler;
