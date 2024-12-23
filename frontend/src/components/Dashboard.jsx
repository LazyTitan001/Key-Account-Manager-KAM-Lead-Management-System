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

  const handleMarkAsDone = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/interactions/mark-done/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchPendingCalls(); // Refresh the pending calls list
    } catch (error) {
      console.error('Error marking interaction as done:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold text-gray-100">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats-card">
          <h3 className="stats-label">New Leads</h3>
          <p className="stats-value">{summary.new_leads}</p>
        </div>
        <div className="stats-card">
          <h3 className="stats-label">Active Leads</h3>
          <p className="stats-value">{summary.active_leads}</p>
        </div>
        <div className="stats-card">
          <h3 className="stats-label">Inactive Leads</h3>
          <p className="stats-value">{summary.inactive_leads}</p>
        </div>
      </div>

      {/* Pending Calls */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">Today's Pending Calls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingCalls.map(call => (
            <div key={call.id} className="dark-card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-100">{call.restaurant_name}</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(call.interaction_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">{call.notes}</p>
                </div>
                <button
                  onClick={() => handleMarkAsDone(call.id)}
                  className="secondary-button text-xs"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.recent_interactions.map(interaction => (
            <div key={interaction.id} className="dark-card">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-blue-400 font-medium">{interaction.interaction_type}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(interaction.interaction_date).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="text-gray-100 font-medium">{interaction.restaurant_name}</div>
                <p className="text-gray-400 text-sm">{interaction.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;