// src/components/LeadList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../api/axiosInstance';

function LeadList() {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axiosInstance.get('/api/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchLeads();
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/leads/search/${searchQuery}`);
      setLeads(response.data);
    } catch (error) {
      console.error('Error searching leads:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Leads Management</h1>
        <Link to="/leads/add" className="primary-button">
          + Add New Lead
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads by name, status, or KAM..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="dark-input pl-10 w-full"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map(lead => (
          <Link 
            to={`/leads/${lead.id}`} 
            key={lead.id} 
            className="dark-card hover:border-blue-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                {lead.restaurant_name}
              </h3>
              <span className={`status-badge ${lead.status.toLowerCase()}`}>
                {lead.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-400 flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {lead.address}
              </p>
              <p className="text-gray-400 flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                {lead.contact_number}
              </p>
              <p className="text-gray-400 flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                KAM: {lead.assigned_kam}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LeadList;