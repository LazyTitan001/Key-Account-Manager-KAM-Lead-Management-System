const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Interaction = require('../models/interaction');

// Validation schema
const interactionSchema = z.object({
  lead_id: z.number(),
  interaction_date: z.string().optional(), // Automatically assigned
  interaction_type: z.string(),
  notes: z.string(),
  follow_up_required: z.boolean(),
  next_interaction_date: z.string().nullable().optional() // Add next_interaction_date
});

// Create new interaction
router.post('/', async (req, res) => {
  try {
    interactionSchema.parse(req.body);
    const interactionId = await Interaction.create(req.body);
    res.status(201).json({ id: interactionId, message: 'Interaction created successfully' });
  } catch (error) {
    console.error('Error creating interaction:', error); // Add error logging
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

// Mark pending call as done
router.put('/mark-done/:id', async (req, res) => {
  try {
    const interactionId = req.params.id;
    await Interaction.markAsDone(interactionId);
    res.status(200).json({ message: 'Interaction marked as done' });
  } catch (error) {
    console.error('Error marking interaction as done:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recent interactions
router.get('/recent', async (req, res) => {
  try {
    const recentInteractions = await Interaction.getRecent();
    res.json(recentInteractions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;