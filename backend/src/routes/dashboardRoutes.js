const express = require('express');
const router = express.Router();
const Dashboard = require('../models/dashboard');

// Get dashboard summary
router.get('/summary', async (req, res) => {
  try {
    const summary = await Dashboard.getSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
