const db = require('../config/db');
const Interaction = require('./interaction');

class Dashboard {
    // Method to get the summary of leads and interactions
    static async getSummary() {
        try {
            // Query to get the count and names of leads based on their status
            const [summary] = await db.query(`
                SELECT 
                    COUNT(CASE WHEN status = 'New' THEN 1 END) as new_leads,
                    COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_leads,
                    COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_leads,
                    GROUP_CONCAT(CASE WHEN status = 'New' THEN restaurant_name END) as new_lead_names,
                    GROUP_CONCAT(CASE WHEN status = 'Active' THEN restaurant_name END) as active_lead_names,
                    GROUP_CONCAT(CASE WHEN status = 'Inactive' THEN restaurant_name END) as inactive_lead_names
                FROM leads
            `);

            // Get recent interactions
            const recentInteractions = await Interaction.getRecent();
            // Get today's pending calls
            const pendingCalls = await Interaction.getTodaysPendingCalls();

            // Return the summary along with recent interactions and pending calls
            return {
                ...summary[0],
                recent_interactions: recentInteractions,
                pending_calls: pendingCalls 
            };
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            throw error;
        }
    }
}

module.exports = Dashboard;
