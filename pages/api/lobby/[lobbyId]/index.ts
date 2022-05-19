import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import redis from '../../../../lib/redis';

function generateNewRoomId(lobbyId: string): string {
    return `${lobbyId}/${nanoid(12)}`;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const lobbyId = req.query.lobbyId as string;
    const roomId =
        // TODO: Improve this algo, look at actual room occupancy
        (await redis.srandmember(`${lobbyId}:rooms`)) ?? generateNewRoomId(lobbyId);
    res.status(200).json({ roomId });
};

export default handler;
