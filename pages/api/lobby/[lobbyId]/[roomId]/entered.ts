import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../../../lib/redis';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;
    const roomId = req.query.roomId as string;

    // TODO: Replace this by some real placement logic
    const results = await redis.zincrby(lobbyId, 1, roomId);
    res.status(200).json({ ok: true, results });
};

export default handler;
