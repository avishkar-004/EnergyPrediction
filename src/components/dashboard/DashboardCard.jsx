// components/dashboard/DashboardCard.jsx
import React from 'react';
import { Activity, Zap, Server, Target } from 'lucide-react';

const DashboardCard = ({ title, value, icon, color }) => {
  const getIcon = () => {
    switch (icon) {
      case 'activity':
        return <Activity size={24} />;
      case 'zap':
        return <Zap size={24} />;
      case 'server':
        return <Server size={24} />;
      case 'target':
        return <Target size={24} />;
      default:
        return <Activity size={24} />;
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-500 bg-blue-100';
      case 'green':
        return 'text-green-500 bg-green-100';
      case 'yellow':
        return 'text-yellow-500 bg-yellow-100';
      case 'purple':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-blue-500 bg-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${getColorClass()} mr-4`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
