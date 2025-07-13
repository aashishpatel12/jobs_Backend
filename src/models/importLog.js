const mongoose = require('mongoose');

const importLogSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, default: Date.now 
   },
  totalFetched:{
    type:Number
  },
  totalImported: {
    type:Number
  },
  newJobs: {
    type:Number
  },
  updatedJobs: {
    type:Number
  },
  failedJobs: 
  [
    { jobData: Object, reason: String }
  ]
});

module.exports = mongoose.model('ImportLog', importLogSchema);
