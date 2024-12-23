const cron = require('node-cron');
const Interaction = require('./models/interaction');

// Schedule a task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const deletedRows = await Interaction.deleteOldPendingCalls();
    console.log(`Deleted ${deletedRows} old pending calls`);
  } catch (error) {
    console.error('Error running scheduled task:', error);
  }
});
