const db = require('../config/db');
const Interaction = require('./interaction');

class Dashboard {
    static async getSummary() {
        try {
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

            const recentInteractions = await Interaction.getRecent();
            const pendingCalls = await Interaction.getTodaysPendingCalls();

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
