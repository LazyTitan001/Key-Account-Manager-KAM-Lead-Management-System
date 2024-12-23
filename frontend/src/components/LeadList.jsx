// src/components/LeadList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LeadList() {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/leads');
      const data = await response.json();
      setLeads(data);
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
      const response = await fetch(`http://localhost:3000/api/leads/search/${searchQuery}`);
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error searching leads:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
        <Link to="/leads/add" className="bg-blue-600 text-white px-4 py-2 rounded">Add New Lead</Link>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 flex-grow"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 ml-2">Search</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map(lead => (
          <Link to={`/leads/${lead.id}`} key={lead.id} className="border p-4 rounded shadow hover:bg-gray-100 transition">
            <h3 className="text-xl font-bold text-gray-800">{lead.restaurant_name}</h3>
            <p className="text-gray-600">{lead.address}</p>
            <p className="text-gray-600">Contact: {lead.contact_number}</p>
            <span className={`status-badge ${lead.status.toLowerCase()}`}>
              {lead.status}
            </span>
            <p className="text-gray-600">KAM: {lead.assigned_kam}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LeadList;