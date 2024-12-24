const db = require('../config/db');

// Contact class to handle database operations related to contacts
class Contact {
    // Create a new contact
    static async create(contactData) {
        try {
            const [result] = await db.execute(
                'INSERT INTO contacts (lead_id, name, role, phone_number, email) VALUES (?, ?, ?, ?, ?)',
                [contactData.lead_id, contactData.name, contactData.role, contactData.phone_number, contactData.email]
            );
            return result.insertId; // Return the ID of the newly created contact
        } catch (error) {
            console.error('Error creating contact:', error);
            throw error; // Throw the error to be handled by the caller
        }
    }

    // Get contacts by lead ID
    static async getByLeadId(leadId) {
        try {
            const [contacts] = await db.execute('SELECT * FROM contacts WHERE lead_id = ?', [leadId]);
            return contacts; // Return the list of contacts for the given lead ID
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw error; // Throw the error to be handled by the caller
        }
    }

    // Update an existing contact
    static async update(id, contactData) {
        try {
            const [result] = await db.execute(
                'UPDATE contacts SET lead_id = ?, name = ?, role = ?, phone_number = ?, email = ? WHERE id = ?',
                [contactData.lead_id, contactData.name, contactData.role, contactData.phone_number, contactData.email, id]
            );
            return result; // Return the result of the update operation
        } catch (error) {
            console.error('Error updating contact:', error);
            throw error; // Throw the error to be handled by the caller
        }
    }
}

module.exports = Contact;