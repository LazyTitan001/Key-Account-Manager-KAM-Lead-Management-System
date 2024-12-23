// src/components/AddLead.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddLead() {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState({
    restaurant_name: '',
    address: '',
    contact_number: '',
    status: 'New',
    assigned_kam: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (response.ok) {
        const data = await response.json();
        navigate(`/leads/${data.id}`);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Lead</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Restaurant Name</label>
          <input
            type="text"
            value={leadData.restaurant_name}
            onChange={(e) => setLeadData({...leadData, restaurant_name: e.target.value})}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <textarea
            value={leadData.address}
            onChange={(e) => setLeadData({...leadData, address: e.target.value})}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Contact Number</label>
          <input
            type="tel"
            value={leadData.contact_number}
            onChange={(e) => setLeadData({...leadData, contact_number: e.target.value})}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Status</label>
          <select
            value={leadData.status}
            onChange={(e) => setLeadData({...leadData, status: e.target.value})}
            required
            className="border p-2 w-full"
          >
            <option value="New">New</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Assigned KAM</label>
          <input
            type="text"
            value={leadData.assigned_kam}
            onChange={(e) => setLeadData({...leadData, assigned_kam: e.target.value})}
            required
            className="border p-2 w-full"
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Lead</button>
          <button type="button" onClick={() => navigate('/leads')} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLead;