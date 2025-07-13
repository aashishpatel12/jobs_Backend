

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const jobRoutes = require('./routes/JobRoutes');
const fetchAndQueueJobs = require('./jobs/jobFetcher');
require('./workers/jobWorkers');
require("dotenv").config()


const app = express();
app.use(cors());
app.use(express.json());


app.use('/jobs', jobRoutes);


cron.schedule('0 * * * *', async () => {
  await fetchAndQueueJobs();
});

if (process.env.NODE_ENV !== 'production') {
  fetchAndQueueJobs();
}

module.exports = app;
