const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const ImportLog = require('../models/importLog');

router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const query = {
      $or: [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ]
    };

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);
    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ 
        success:true,
        jobs, 
        totalPages, 
        currentPage: page });
  } catch (err) {
    res.status(500).json({ 
        success:false,
        message:"server error..",
        error: 'Server error',err 
    });
  }
});

router.get('/logs', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
  
      const totalLogs = await ImportLog.countDocuments();
      const totalPages = Math.ceil(totalLogs / limit);
      const logs = await ImportLog.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ timestamp: -1 });
  
      res.status(200).json({ 
        success:true,
        message:"data Get successfully",
        logs, 
        totalPages, 
        currentPage: page });
    } catch (err) {
      console.error('Error fetching logs:', err.message);
      res.status(500).json({ 
        success:false,
        message:"server error..",
        error: 'Failed to fetch logs',err
     });
    }
  });
  
module.exports = router;