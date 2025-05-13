// components/dashboard/SummaryStats.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchSummaryStats } from '../../services/api';

const SummaryStats = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummaryData = async () => {
      try {
        const data = await fetchSummaryStats();
        setSummaryData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading summary stats:', error);
        setLoading(false);
      }
    };

    loadSummaryData();
  }, []);

  if (loading) {
    return <div className="h-64 flex justify-center items-center">Loading summary stats...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Monthly Consumption Overview</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={summaryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" fill="#3B82F6" name="Actual Consumption" />
            <Bar dataKey="predicted" fill="#10B981" name="Predicted Consumption" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryStats;
