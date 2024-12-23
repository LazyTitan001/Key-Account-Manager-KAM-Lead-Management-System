const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Lead = require('../models/lead');

// Validation schema
const leadSchema = z.object({
  restaurant_name: z.string(),
  address: z.string(),
  contact_number: z.string(),
  status: z.string(),
  assigned_kam: z.string()
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    leadSchema.parse(req.body);
    const leadId = await Lead.create(req.body);
    res.status(201).json({ id: leadId, message: 'Lead created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.getAll();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lead by ID
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    await Lead.update(req.params.id, req.body);
    res.json({ message: 'Lead updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search leads
router.get('/search/:query', async (req, res) => {
  try {
    const leads = await Lead.search(req.params.query);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;