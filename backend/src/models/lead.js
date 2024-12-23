const db = require('../config/db');

// ...existing code...

class Lead {
    static async create(leadData) {
        const [result] = await db.execute(
            'INSERT INTO leads (restaurant_name, address, contact_number, status, assigned_kam) VALUES (?, ?, ?, ?, ?)',
            [leadData.restaurant_name, leadData.address, leadData.contact_number, leadData.status, leadData.assigned_kam]
        );
        return result.insertId;
    }

    static async getAll() {
        const [leads] = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
        return leads;
    }

    static async getById(id) {
        const [leads] = await db.execute('SELECT * FROM leads WHERE id = ?', [id]);
        return leads[0];
    }

    static async update(id, leadData) {
        const [result] = await db.execute(
            'UPDATE leads SET restaurant_name = ?, address = ?, contact_number = ?, status = ?, assigned_kam = ? WHERE id = ?',
            [leadData.restaurant_name, leadData.address, leadData.contact_number, leadData.status, leadData.assigned_kam, id]
        );
        return result;
    }

    static async search(query) {
        const [leads] = await db.execute(
            'SELECT * FROM leads WHERE restaurant_name LIKE ? OR address LIKE ? OR contact_number LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );
        return leads;
    }

    static async getDashboardSummary() {
        const [result] = await db.query(`
            SELECT 
                COUNT(CASE WHEN status = 'New' THEN 1 END) as new_leads,
                COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_leads,
                COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_leads
            FROM leads
        `);
        return result[0];
    }
}

module.exports = Lead;