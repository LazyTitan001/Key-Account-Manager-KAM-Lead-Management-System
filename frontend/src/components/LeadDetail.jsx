// src/components/LeadDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    interaction_date: '',
    interaction_type: '',
    notes: '',
    follow_up_required: false,
    next_interaction_date: '' 
  });
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    phone_number: '',
    email: ''
  });

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const fetchLeadData = async () => {
    try {
      const [leadRes, contactsRes, interactionsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/leads/${id}`),
        fetch(`http://localhost:3000/api/contacts/lead/${id}`),
        fetch(`http://localhost:3000/api/interactions/lead/${id}`)
      ]);

      const [leadData, contactsData, interactionsData] = await Promise.all([
        leadRes.json(),
        contactsRes.json(),
        interactionsRes.json()
      ]);

      setLead(leadData);
      setContacts(contactsData);
      setInteractions(interactionsData);
    } catch (error) {
      console.error('Error fetching lead data:', error);
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await fetch('http://localhost:3000/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newInteraction,
          lead_id: Number(id),
          interaction_date: formattedDate, 
          next_interaction_date: newInteraction.follow_up_required ? new Date(newInteraction.next_interaction_date).toISOString().split('T')[0] : null 
        }),
      });
      fetchLeadData();
      setNewInteraction({
        interaction_date: '',
        interaction_type: '',
        notes: '',
        follow_up_required: false,
        next_interaction_date: '' 
      });
      setShowInteractionForm(false);
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newContact,
          lead_id: Number(id) 
        }),
      });
      fetchLeadData();
      setNewContact({
        name: '',
        role: '',
        phone_number: '',
        email: ''
      });
      setShowContactForm(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{lead.restaurant_name}</h1>
        <div className="mt-2">
          <p className="text-gray-600"><strong>Address:</strong> {lead.address}</p>
          <p className="text-gray-600"><strong>Contact:</strong> {lead.contact_number}</p>
          <p className="text-gray-600"><strong>Status:</strong> {lead.status}</p>
          <p className="text-gray-600"><strong>KAM:</strong> {lead.assigned_kam}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map(contact => (
            <div key={contact.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold text-gray-800">{contact.name}</h3>
              <p className="text-gray-600">Role: {contact.role}</p>
              <p className="text-gray-600">Phone: {contact.phone_number}</p>
              <p className="text-gray-600">Email: {contact.email}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowContactForm(!showContactForm)} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          {showContactForm ? 'Cancel' : 'Add New Contact'}
        </button>
        {showContactForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <form onSubmit={handleAddContact}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Contact</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  required
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newContact.role}
                  onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                  required
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone_number}
                  onChange={(e) => setNewContact({...newContact, phone_number: e.target.value})}
                  required
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  required
                  className="border p-2 w-full mb-2"
                />
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowContactForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Contact</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Interactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interactions.map(interaction => (
            <div key={interaction.id} className="border p-4 rounded shadow">
              <p className="text-gray-600"><strong>Date:</strong> {new Date(interaction.interaction_date).toLocaleDateString()}</p>
              <p className="text-gray-600"><strong>Type:</strong> {interaction.interaction_type}</p>
              <p className="text-gray-600"><strong>Notes:</strong> {interaction.notes}</p>
              <p className="text-gray-600"><strong>Follow-up Required:</strong> {interaction.follow_up_required ? 'Yes' : 'No'}</p>
              {interaction.follow_up_required ? (
                <p className="text-gray-600"><strong>Follow-up Date:</strong> {new Date(interaction.next_interaction_date).toLocaleDateString()}</p>
              ) : (
                <p className="text-gray-600"><strong>Follow-up Date:</strong> No follow-up needed</p>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setShowInteractionForm(!showInteractionForm)} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          {showInteractionForm ? 'Cancel' : 'Add New Interaction'}
        </button>
        {showInteractionForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <form onSubmit={handleAddInteraction}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Interaction</h3>
                <select
                  value={newInteraction.interaction_type}
                  onChange={(e) => setNewInteraction({...newInteraction, interaction_type: e.target.value})}
                  required
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Select Type</option>
                  <option value="Call">Call</option>
                  <option value="Visit">Visit</option>
                  <option value="Order">Order</option>
                </select>
                <textarea
                  placeholder="Notes"
                  value={newInteraction.notes}
                  onChange={(e) => setNewInteraction({...newInteraction, notes: e.target.value})}
                  required
                  className="border p-2 w-full mb-2"
                />
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={newInteraction.follow_up_required}
                    onChange={(e) => setNewInteraction({...newInteraction, follow_up_required: e.target.checked})}
                    className="mr-2"
                  />
                  Follow-up Required
                </label>
                {newInteraction.follow_up_required && (
                  <input
                    type="date"
                    value={newInteraction.next_interaction_date}
                    onChange={(e) => setNewInteraction({...newInteraction, next_interaction_date: e.target.value})}
                    required
                    className="border p-2 w-full mb-2"
                  />
                )}
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowInteractionForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Interaction</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadDetail;