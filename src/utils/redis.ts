import { Redis } from "ioredis";
import "dotenv/config";

const redisClient = () => {
	if (process.env.UPSTASH_REDIS_URL) {
		console.log("Redis connect successfully");
		return process.env.UPSTASH_REDIS_URL;
	}
	throw new Error("Redis connection failed");
};

export const redis = new Redis(redisClient());
