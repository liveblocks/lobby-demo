import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../../lib/redis';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;
    await redis.del(`${lobbyId}:rooms`);
    res.status(200).json({ ok: true });
};

export default handler;