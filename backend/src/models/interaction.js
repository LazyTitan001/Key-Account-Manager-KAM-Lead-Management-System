const db = require('../config/db');

const formatDateTime = (date) => {
  const d = new Date(date);
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// Interaction model class
class Interaction {
    // Create a new interaction
    static async create(interactionData) {
        try {
            const formattedDate = formatDateTime(new Date());
            const [result] = await db.execute(
                'INSERT INTO interactions (lead_id, interaction_date, interaction_type, notes, follow_up_required, next_interaction_date) VALUES (?, ?, ?, ?, ?, ?)',
                [interactionData.lead_id, formattedDate, interactionData.interaction_type, interactionData.notes, interactionData.follow_up_required, interactionData.next_interaction_date]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error inserting interaction:', error); // Add error logging
            throw error;
        }
    }

    // Get interactions by lead ID
    static async getByLeadId(leadId) {
        const [interactions] = await db.execute('SELECT * FROM interactions WHERE lead_id = ? ORDER BY interaction_date DESC', [leadId]);
        return interactions;
    }

    // Get today's pending calls
    static async getTodaysPendingCalls() {
        const [interactions] = await db.execute(
            `SELECT i.*, l.restaurant_name 
             FROM interactions i 
             JOIN leads l ON i.lead_id = l.id 
             WHERE (DATE(CONVERT_TZ(i.next_interaction_date, '+00:00', '+05:30')) = CURDATE() OR DATE(CONVERT_TZ(i.next_interaction_date, '+00:00', '+05:30')) < CURDATE()) 
             AND i.follow_up_required = true`
        );
        return interactions;
    }

    // Get recent interactions
    static async getRecent() {
        const [interactions] = await db.execute(
            'SELECT i.*, l.restaurant_name FROM interactions i JOIN leads l ON i.lead_id = l.id ORDER BY i.interaction_date DESC LIMIT 10'
        );
        return interactions;
    }

    // Delete interactions that are more than 2 days past
    static async deleteOldPendingCalls() {
        try {
            const [result] = await db.execute(
                `DELETE FROM interactions 
                 WHERE follow_up_required = true 
                 AND next_interaction_date < DATE_SUB(CURDATE(), INTERVAL 2 DAY)`
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Error deleting old pending calls:', error);
            throw error;
        }
    }

    // Mark interaction as done
    static async markAsDone(interactionId) {
        try {
            const [result] = await db.execute(
                'UPDATE interactions SET follow_up_required = false WHERE id = ?',
                [interactionId]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Error marking interaction as done:', error);
            throw error;
        }
    }
}

module.exports = Interaction;