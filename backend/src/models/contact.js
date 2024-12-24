const db = require('../config/db');

class Contact {
    static async create(contactData) {
        try {
            const [result] = await db.execute(
                'INSERT INTO contacts (lead_id, name, role, phone_number, email) VALUES (?, ?, ?, ?, ?)',
                [contactData.lead_id, contactData.name, contactData.role, contactData.phone_number, contactData.email]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating contact:', error);
            throw error;
        }
    }

    static async getByLeadId(leadId) {
        try {
            const [contacts] = await db.execute('SELECT * FROM contacts WHERE lead_id = ?', [leadId]);
            return contacts;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw error;
        }
    }

    static async update(id, contactData) {
        try {
            const [result] = await db.execute(
                'UPDATE contacts SET lead_id = ?, name = ?, role = ?, phone_number = ?, email = ? WHERE id = ?',
                [contactData.lead_id, contactData.name, contactData.role, contactData.phone_number, contactData.email, id]
            );
            return result;
        } catch (error) {
            console.error('Error updating contact:', error);
            throw error;
        }
    }
}

module.exports = Contact;