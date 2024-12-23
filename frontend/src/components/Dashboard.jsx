// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';

function Dashboard() {
  const [summary, setSummary] = useState({
    new_leads: 0,
    active_leads: 0,
    inactive_leads: 0,
    recent_interactions: []
  });
  const [pendingCalls, setPendingCalls] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchPendingCalls();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/summary');
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchPendingCalls = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/interactions/pending-calls');
      const data = await response.json();
      setPendingCalls(data);
    } catch (error) {
      console.error('Error fetching pending calls:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-gray-800">New Leads</h3>
          <p className="text-2xl text-gray-600">{summary.new_leads}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-gray-800">Active Leads</h3>
          <p className="text-2xl text-gray-600">{summary.active_leads}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-gray-800">Inactive Leads</h3>
          <p className="text-2xl text-gray-600">{summary.inactive_leads}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Today's Pending Calls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingCalls.map(call => (
            <div key={call.id} className="bg-white p-4 rounded shadow">
              <h4 className="text-lg font-bold text-gray-800">{call.restaurant_name}</h4>
              <p className="text-gray-600">Date: {new Date(call.interaction_date).toLocaleDateString()}</p>
              <p className="text-gray-600">{call.notes}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Recent Interactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.recent_interactions.map(interaction => (
            <div key={interaction.id} className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Type: {interaction.interaction_type}</p>
              <p className="text-gray-600">Date: {new Date(interaction.interaction_date).toLocaleDateString()}</p>
              <p className="text-gray-600">{interaction.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;