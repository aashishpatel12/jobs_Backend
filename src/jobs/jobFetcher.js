
const axios = require('axios');
const xmlToJson = require('../services/xmlToJson');
const jobQueue = require('../queues/jobQueue');

const urls = [
    'https://jobicy.com/?feed=job_feed',
    'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
    'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
    'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
    'https://jobicy.com/?feed=job_feed&job_categories=data-science',
    'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
    'https://jobicy.com/?feed=job_feed&job_categories=business',
    'https://jobicy.com/?feed=job_feed&job_categories=management',
  ];

module.exports = async function fetchAndQueueJobs() {
 
  for (const url of urls) {
    try {
      const { data } = await axios.get(url);
      const jobs = await xmlToJson(data);

      await jobQueue.add('import-jobs', { jobs });

    } catch (err) {
      console.error(`Failed to fetch from ${url}:`, err.message);
    }
  }

};
