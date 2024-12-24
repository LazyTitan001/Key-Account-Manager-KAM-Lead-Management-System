const express = require('express');
const cors = require('cors');
const leadRoutes = require('./routes/leadRoutes');
const contactRoutes = require('./routes/contactRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const scheduler = require('./scheduler'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  scheduler;
});