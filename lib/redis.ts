import Redis from 'ioredis';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : new Redis();

export default redis;
