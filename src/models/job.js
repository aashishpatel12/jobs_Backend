const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: {
    type:String
  },
  title: {
    type:String
  },
  description: {
    type:String
  },
  link: {
    type:String
  },
  pubDate: {
    type:Date
  },
  category: {
    type:String
  },
  location: {
    type:String
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);