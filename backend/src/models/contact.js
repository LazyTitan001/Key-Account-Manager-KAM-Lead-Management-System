const db = require('../config/db');

class Contact {
    static async create(contactData) {
        const [result] = await db.execute(
            'INSERT INTO contacts (lead_id, name, role, phone_number, email) VALUES (?, ?, ?, ?, ?)',
            [contactData.lead_id, contactData.name, contactData.role, contactData.phone_number, contactData.email]
        );
        return result.insertId;
    }

    static async getByLeadId(leadId) {
        const [contacts] = await db.execute('SELECT * FROM contacts WHERE lead_id = ?', [leadId]);
        return contacts;
    }

    static async update(id, contactData) {
        const [result] = await db.execute(
            'UPDATE contacts SET lead_id = ?, name = ?, role = ?, phone_number = ?, email = ? WHERE id = ?',
            [contactData.lead_id, contactData.name, contactData.role, contactData.phone_number, contactData.email, id]
        );
        return result;
    }
}

module.exports = Contact;