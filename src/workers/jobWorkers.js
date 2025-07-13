

const { Worker } = require('bullmq');
const Redis = require('ioredis');
const Job = require('../models/job');
const ImportLog = require('../models/importLog');
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const worker = new Worker(
  'jobQueue',
  async job => {
    const jobs = job.data.jobs;
    const timestamp = new Date();

    let newJobs = 0,
      updatedJobs = 0,
      failedJobs = [];

    for (const item of jobs) {
      
      const jobId =
        typeof item.guid === 'object'
          ? item.guid._ || item.guid['#text']
          : item.guid || item.link || item.title;

      if (!jobId) {
        failedJobs.push({
          jobData: item,
          reason: 'Missing jobId (guid/link/title not found)',
        });
        continue;
      }

      try {
        const existing = await Job.findOne({ jobId });

        if (existing) {
          await Job.updateOne({ jobId }, item);
          updatedJobs++;
        } else {
          await Job.create({ ...item, jobId });
          newJobs++;
        }
      } catch (err) {
        failedJobs.push({ jobData: item, reason: err.message });
      }
    }

  
    await ImportLog.create({
      timestamp,
      totalFetched: jobs.length,
      totalImported: newJobs + updatedJobs,
      newJobs,
      updatedJobs,
      failedJobs,
    });

  },
  {
    connection,
    concurrency: 5,
  }
);

module.exports = worker;
