import { env } from "../config/env.js"
import { Redis } from "ioredis"

const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
});

export { redis };
