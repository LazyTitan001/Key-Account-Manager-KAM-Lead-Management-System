const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Interaction = require('../models/interaction');

// Validation schema
const interactionSchema = z.object({
  lead_id: z.number(),
  interaction_date: z.string(), 
  interaction_type: z.string(),
  notes: z.string(),
  follow_up_required: z.boolean()
});

// Create new interaction
router.post('/', async (req, res) => {
  try {
    interactionSchema.parse(req.body);
    const interactionId = await Interaction.create(req.body);
    res.status(201).json({ id: interactionId, message: 'Interaction created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get interactions for a lead
router.get('/lead/:leadId', async (req, res) => {
  try {
    const interactions = await Interaction.getByLeadId(req.params.leadId);
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's pending calls
router.get('/pending-calls', async (req, res) => {
  try {
    const pendingCalls = await Interaction.getTodaysPendingCalls();
    res.json(pendingCalls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;