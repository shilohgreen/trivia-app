import Redis from 'ioredis';

// Define the types for environment variables to ensure type safety
const redisHost: string = process.env.REDIS_HOST || '127.0.0.1';
const redisPort: number = parseInt(process.env.REDIS_PORT || '6379', 10);

// Create Redis instance with proper type handling
const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

export default redis;
