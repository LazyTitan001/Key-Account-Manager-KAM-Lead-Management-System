const express = require('express');
const app = express();
const scheduler = require('./scheduler'); // Import the scheduler

// ...existing code...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  scheduler; // Start the scheduler
});
