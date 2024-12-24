// src/components/LeadDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import axiosInstance from '../api/axiosInstance';

function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showUpdateContactForm, setShowUpdateContactForm] = useState(false);
  const [contactToUpdate, setContactToUpdate] = useState(null);
  const [showUpdateLeadForm, setShowUpdateLeadForm] = useState(false);
  const [leadToUpdate, setLeadToUpdate] = useState(null);
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
        axiosInstance.get(`/api/leads/${id}`),
        axiosInstance.get(`/api/contacts/lead/${id}`),
        axiosInstance.get(`/api/interactions/lead/${id}`)
      ]);

      setLead(leadRes.data);
      setContacts(contactsRes.data);
      setInteractions(interactionsRes.data);
    } catch (error) {
      console.error('Error fetching lead data:', error);
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await axiosInstance.post('/api/interactions', {
        ...newInteraction,
        lead_id: Number(id),
        interaction_date: formattedDate, 
        next_interaction_date: newInteraction.follow_up_required ? new Date(newInteraction.next_interaction_date).toISOString().split('T')[0] : null 
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
      await axiosInstance.post('/api/contacts', {
        ...newContact,
        lead_id: Number(id) 
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

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/contacts/${contactToUpdate.id}`, contactToUpdate);
      fetchLeadData();
      setContactToUpdate(null);
      setShowUpdateContactForm(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/leads/${leadToUpdate.id}`, leadToUpdate);
      fetchLeadData();
      setLeadToUpdate(null);
      setShowUpdateLeadForm(false);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const categories = ['Contacts', 'Interactions'];

  if (!lead) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="dark-card mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">{lead.restaurant_name}</h1>
            <p className="text-gray-400">{lead.address}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`status-badge ${lead.status.toLowerCase()}`}>
              {lead.status}
            </span>
            <button 
              onClick={() => {
                setLeadToUpdate(lead);
                setShowUpdateLeadForm(true);
              }}
              className="secondary-button"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-dark-100">
          <div>
            <p className="text-sm text-gray-400">Contact Number</p>
            <p className="text-gray-100">{lead.contact_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Assigned KAM</p>
            <p className="text-gray-100">{lead.assigned_kam}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Contacts</p>
            <p className="text-gray-100">{contacts.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Interactions</p>
            <p className="text-gray-100">{interactions.length}</p>
          </div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 border-b border-dark-100">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `px-6 py-3 text-sm font-medium leading-5 transition-colors duration-200
                ${selected 
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-dark-50' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-dark-50'
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {/* Contacts Panel */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Contact List</h3>
              <button 
                onClick={() => setShowContactForm(true)}
                className="primary-button"
              >
                + Add Contact
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map(contact => (
                <div key={contact.id} className="dark-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-100">{contact.name}</h4>
                      <p className="text-sm text-blue-400">{contact.role}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setContactToUpdate(contact);
                        setShowUpdateContactForm(true);
                      }}
                      className="secondary-button"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400 flex items-center">
                      <span className="mr-2">📞</span> {contact.phone_number}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center">
                      <span className="mr-2">✉️</span> {contact.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* Interactions Panel */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Interaction History</h3>
              <button 
                onClick={() => setShowInteractionForm(true)}
                className="primary-button"
              >
                + Add Interaction
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interactions.map(interaction => (
                <div key={interaction.id} className="dark-card p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${
                        interaction.interaction_type === 'Call' ? 'bg-blue-400' :
                        interaction.interaction_type === 'Visit' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></span>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100">
                          {interaction.interaction_type}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {new Date(interaction.interaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {interaction.follow_up_required && (
                      <span className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded">
                        Follow-up Required
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-gray-300">{interaction.notes}</p>
                  {interaction.follow_up_required && (
                    <p className="mt-2 text-sm text-gray-400">
                      Follow-up Date: {new Date(interaction.next_interaction_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Updated Modal Forms */}
      {showContactForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="dark-card w-full max-w-md">
            <form onSubmit={handleAddContact} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-100 mb-6">Add New Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="Contact role"
                    value={newContact.role}
                    onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Contact phone"
                    value={newContact.phone_number}
                    onChange={(e) => setNewContact({...newContact, phone_number: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Contact email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => setShowContactForm(false)} className="secondary-button">
                  Cancel
                </button>
                <button type="submit" className="primary-button">Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showInteractionForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="dark-card w-full max-w-md">
            <form onSubmit={handleAddInteraction} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-100 mb-6">Add New Interaction</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Type</label>
                  <select
                    value={newInteraction.interaction_type}
                    onChange={(e) => setNewInteraction({...newInteraction, interaction_type: e.target.value})}
                    required
                    className="dark-input w-full"
                  >
                    <option value="">Select Type</option>
                    <option value="Call">Call</option>
                    <option value="Visit">Visit</option>
                    <option value="Order">Order</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Notes</label>
                  <textarea
                    placeholder="Interaction details"
                    value={newInteraction.notes}
                    onChange={(e) => setNewInteraction({...newInteraction, notes: e.target.value})}
                    required
                    className="dark-input w-full h-24"
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newInteraction.follow_up_required}
                    onChange={(e) => setNewInteraction({...newInteraction, follow_up_required: e.target.checked})}
                    className="rounded bg-dark-100 border-dark-50 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Follow-up Required</span>
                </label>
                {newInteraction.follow_up_required && (
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={newInteraction.next_interaction_date}
                      onChange={(e) => setNewInteraction({...newInteraction, next_interaction_date: e.target.value})}
                      required
                      className="dark-input w-full"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => setShowInteractionForm(false)} className="secondary-button">
                  Cancel
                </button>
                <button type="submit" className="primary-button">Add Interaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateContactForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="dark-card w-full max-w-md">
            <form onSubmit={handleUpdateContact} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-100 mb-6">Update Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={contactToUpdate.name}
                    onChange={(e) => setContactToUpdate({...contactToUpdate, name: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="Contact role"
                    value={contactToUpdate.role}
                    onChange={(e) => setContactToUpdate({...contactToUpdate, role: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Contact phone"
                    value={contactToUpdate.phone_number}
                    onChange={(e) => setContactToUpdate({...contactToUpdate, phone_number: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Contact email"
                    value={contactToUpdate.email}
                    onChange={(e) => setContactToUpdate({...contactToUpdate, email: e.target.value})}
                    required
                    className="dark-input w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => setShowUpdateContactForm(false)} className="secondary-button">
                  Cancel
                </button>
                <button type="submit" className="primary-button">Update Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateLeadForm && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="dark-card w-full max-w-md">
              <form onSubmit={handleUpdateLead} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-100 mb-6">Update Lead</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      placeholder="Restaurant name"
                      value={leadToUpdate.restaurant_name}
                      onChange={(e) => setLeadToUpdate({...leadToUpdate, restaurant_name: e.target.value})}
                      required
                      className="dark-input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={leadToUpdate.address}
                      onChange={(e) => setLeadToUpdate({...leadToUpdate, address: e.target.value})}
                      required
                      className="dark-input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Contact Number</label>
                    <input
                      type="tel"
                      placeholder="Contact number"
                      value={leadToUpdate.contact_number}
                      onChange={(e) => setLeadToUpdate({...leadToUpdate, contact_number: e.target.value})}
                      required
                      className="dark-input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Status</label>
                    <input
                      type="text"
                      placeholder="Status"
                      value={leadToUpdate.status}
                      onChange={(e) => setLeadToUpdate({...leadToUpdate, status: e.target.value})}
                      required
                      className="dark-input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Assigned KAM</label>
                    <input
                      type="text"
                      placeholder="Assigned KAM"
                      value={leadToUpdate.assigned_kam}
                      onChange={(e) => setLeadToUpdate({...leadToUpdate, assigned_kam: e.target.value})}
                      required
                      className="dark-input w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button type="button" onClick={() => setShowUpdateLeadForm(false)} className="secondary-button">
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">Update Lead</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LeadDetail;