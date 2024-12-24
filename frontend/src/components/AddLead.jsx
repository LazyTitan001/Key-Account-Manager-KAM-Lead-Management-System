// src/components/AddLead.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

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
      const response = await axiosInstance.post('/api/leads', leadData);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      if (response.status === 200 || response.status === 201) {
        navigate('/leads'); // Navigate to the leads list page
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="dark-card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Add New Lead</h1>
          <button 
            onClick={() => navigate('/leads')} 
            className="secondary-button"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Restaurant Name</label>
              <input
                type="text"
                value={leadData.restaurant_name}
                onChange={(e) => setLeadData({...leadData, restaurant_name: e.target.value})}
                required
                className="dark-input w-full"
                placeholder="Enter restaurant name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Address</label>
              <textarea
                value={leadData.address}
                onChange={(e) => setLeadData({...leadData, address: e.target.value})}
                required
                className="dark-input w-full h-24 resize-none"
                placeholder="Enter complete address"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Contact Number</label>
              <input
                type="tel"
                value={leadData.contact_number}
                onChange={(e) => setLeadData({...leadData, contact_number: e.target.value})}
                required
                className="dark-input w-full"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Status</label>
              <select
                value={leadData.status}
                onChange={(e) => setLeadData({...leadData, status: e.target.value})}
                required
                className="dark-input w-full"
              >
                <option value="New">New</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Assigned KAM</label>
              <input
                type="text"
                value={leadData.assigned_kam}
                onChange={(e) => setLeadData({...leadData, assigned_kam: e.target.value})}
                required
                className="dark-input w-full"
                placeholder="Enter KAM name"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-dark-100">
            <button 
              type="submit" 
              className="primary-button w-full"
            >
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLead;