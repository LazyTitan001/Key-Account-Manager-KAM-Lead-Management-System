const db = require('../config/db');

// Lead model class
class Lead {
    // Create a new lead
    static async create(leadData) {
        const [result] = await db.execute(
            'INSERT INTO leads (restaurant_name, address, contact_number, status, assigned_kam) VALUES (?, ?, ?, ?, ?)',
            [leadData.restaurant_name, leadData.address, leadData.contact_number, leadData.status, leadData.assigned_kam]
        );
        return result.insertId;
    }

    // Get all leads
    static async getAll() {
        const [leads] = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
        return leads;
    }

    // Get lead by ID
    static async getById(id) {
        const [leads] = await db.execute('SELECT * FROM leads WHERE id = ?', [id]);
        return leads[0];
    }

    // Update lead
    static async update(id, leadData) {
        const [result] = await db.execute(
            'UPDATE leads SET restaurant_name = ?, address = ?, contact_number = ?, status = ?, assigned_kam = ? WHERE id = ?',
            [leadData.restaurant_name, leadData.address, leadData.contact_number, leadData.status, leadData.assigned_kam, id]
        );
        return result;
    }

    // Search leads
    static async search(query) {
        const [leads] = await db.execute(
            'SELECT * FROM leads WHERE restaurant_name LIKE ? OR address LIKE ? OR contact_number LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );
        return leads;
    }

    // Get dashboard summary
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