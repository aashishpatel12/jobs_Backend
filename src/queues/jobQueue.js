const { Queue } = require('bullmq');
const Redis = require('ioredis');
const redisConnection = new Redis(process.env.REDIS_URL);

const jobQueue = new Queue('jobQueue', {
  connection: redisConnection
});

module.exports = jobQueue;