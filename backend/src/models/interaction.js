const db = require('../config/db');

// Interaction model class
class Interaction {
    // Create a new interaction
    static async create(interactionData) {
        const [result] = await db.execute(
            'INSERT INTO interactions (lead_id, interaction_date, interaction_type, notes, follow_up_required) VALUES (?, ?, ?, ?, ?)',
            [interactionData.lead_id, interactionData.interaction_date, interactionData.interaction_type, interactionData.notes, interactionData.follow_up_required]
        );
        return result.insertId;
    }

    // Get interactions by lead ID
    static async getByLeadId(leadId) {
        const [interactions] = await db.execute('SELECT * FROM interactions WHERE lead_id = ? ORDER BY interaction_date DESC', [leadId]);
        return interactions;
    }

    // Get today's pending calls
    static async getTodaysPendingCalls() {
        const [interactions] = await db.execute(
            'SELECT i.*, l.restaurant_name FROM interactions i JOIN leads l ON i.lead_id = l.id WHERE i.interaction_date = CURDATE() AND i.follow_up_required = true'
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
}

module.exports = Interaction;