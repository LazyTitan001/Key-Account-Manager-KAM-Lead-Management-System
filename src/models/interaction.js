const db = require('../config/db');

class Interaction {
    static async create(interactionData) {
        const [result] = await db.execute(
            'INSERT INTO interactions (lead_id, interaction_date, interaction_type, notes, follow_up_required) VALUES (?, ?, ?, ?, ?)',
            [interactionData.lead_id, interactionData.interaction_date, interactionData.interaction_type, interactionData.notes, interactionData.follow_up_required]
        );
        return result.insertId;
    }

    static async getByLeadId(leadId) {
        const [interactions] = await db.execute('SELECT * FROM interactions WHERE lead_id = ? ORDER BY interaction_date DESC', [leadId]);
        return interactions;
    }

    static async getTodaysPendingCalls() {
        const [interactions] = await db.execute(
            'SELECT i.*, l.restaurant_name FROM interactions i JOIN leads l ON i.lead_id = l.id WHERE i.interaction_date = CURDATE() AND i.follow_up_required = true'
        );
        return interactions;
    }
}

module.exports = Interaction;