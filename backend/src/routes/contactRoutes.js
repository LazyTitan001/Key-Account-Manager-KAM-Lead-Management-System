const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Contact = require('../models/contact');

// Validation schema
const contactSchema = z.object({
  lead_id: z.number(),
  name: z.string(),
  role: z.string(),
  phone_number: z.string(),
  email: z.string().email()
});

// Create new contact
router.post('/', async (req, res) => {
  try {
    contactSchema.parse(req.body);
    const contactId = await Contact.create(req.body);
    res.status(201).json({ id: contactId, message: 'Contact created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get contacts for a lead
router.get('/lead/:leadId', async (req, res) => {
  try {
    const contacts = await Contact.getByLeadId(req.params.leadId);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact
router.put('/:id', async (req, res) => {
  try {
    contactSchema.parse(req.body);
    await Contact.update(req.params.id, req.body);
    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;