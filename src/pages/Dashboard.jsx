// Enhanced Dashboard.jsx Component
import React, { useEffect, useState } from 'react';
import { fetchDashboardData, fetchSummaryStats } from '../services/api';
import DashboardCard from '../components/dashboard/DashboardCard';
import SummaryStats from '../components/dashboard/SummaryStats';
import { Activity, Zap, Server, Target, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

// Import dashboard CSS
import '../styles/dashboard.css';

const EnhancedDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMachines: 0,
    totalConsumption: 0,
    avgEfficiency: 0,
    predictionAccuracy: 0,
    recentAlerts: []
  });
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('month');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        const stats = await fetchSummaryStats(timePeriod);
        
        // Add a small delay to demonstrate loading state (remove in production)
        setTimeout(() => {
          setDashboardData(data);
          setSummaryData(stats);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [timePeriod]);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get trend data for cards
  const getTrendData = (value) => {
    // Mocking trend data - in a real app, this would come from API
    const trends = {
      totalMachines: { value: 5, isUp: true },
      totalConsumption: { value: 7.2, isUp: true },
      avgEfficiency: { value: -2.5, isUp: false },
      predictionAccuracy: { value: 3.8, isUp: true }
    };
    
    return trends[value];
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <div className="dashboard-loading-text">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Energy Consumption Dashboard</h1>
          <p className="dashboard-subtitle">Monitor and analyze your energy usage patterns</p>
        </div>
        
        <div className="time-period-selector">
          <button 
            className={`time-period-option ${timePeriod === 'week' ? 'active' : ''}`}
            onClick={() => setTimePeriod('week')}
          >
            Week
          </button>
          <button 
            className={`time-period-option ${timePeriod === 'month' ? 'active' : ''}`}
            onClick={() => setTimePeriod('month')}
          >
            Month
          </button>
          <button 
            className={`time-period-option ${timePeriod === 'year' ? 'active' : ''}`}
            onClick={() => setTimePeriod('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="dashboard-cards-grid">
        <div className="dashboard-card dashboard-card-enhanced animate-slide-up">
          <div className="dashboard-card-content">
            <div className="dashboard-card-icon-container dashboard-card-icon-blue">
              <Server size={24} />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-card-title">Total Machines</p>
              <p className="dashboard-card-value">{formatNumber(dashboardData.totalMachines)}</p>
              <p className="dashboard-card-subtitle">Active devices</p>
            </div>
          </div>
          <div className="dashboard-card-footer">
            <div className="dashboard-card-trend dashboard-card-trend-positive">
              <TrendingUp size={14} className="dashboard-card-trend-icon" />
              <span className="dashboard-card-trend-value">5%</span>
              <span className="dashboard-card-trend-label">since last month</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card dashboard-card-enhanced animate-slide-up">
          <div className="dashboard-card-content">
            <div className="dashboard-card-icon-container dashboard-card-icon-yellow">
              <Zap size={24} />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-card-title">Total Consumption</p>
              <p className="dashboard-card-value">{formatNumber(dashboardData.totalConsumption)} kWh</p>
              <p className="dashboard-card-subtitle">Current period</p>
            </div>
          </div>
          <div className="dashboard-card-footer">
            <div className="dashboard-card-trend dashboard-card-trend-positive">
              <TrendingUp size={14} className="dashboard-card-trend-icon" />
              <span className="dashboard-card-trend-value">7.2%</span>
              <span className="dashboard-card-trend-label">since last month</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card dashboard-card-enhanced animate-slide-up">
          <div className="dashboard-card-content">
            <div className="dashboard-card-icon-container dashboard-card-icon-green">
              <Activity size={24} />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-card-title">Avg. Efficiency</p>
              <p className="dashboard-card-value">{dashboardData.avgEfficiency}%</p>
              <p className="dashboard-card-subtitle">Overall performance</p>
            </div>
          </div>
          <div className="dashboard-card-footer">
            <div className="dashboard-card-trend dashboard-card-trend-negative">
              <TrendingDown size={14} className="dashboard-card-trend-icon" />
              <span className="dashboard-card-trend-value">2.5%</span>
              <span className="dashboard-card-trend-label">since last month</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card dashboard-card-enhanced animate-slide-up">
          <div className="dashboard-card-content">
            <div className="dashboard-card-icon-container dashboard-card-icon-purple">
              <Target size={24} />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-card-title">Prediction Accuracy</p>
              <p className="dashboard-card-value">{dashboardData.predictionAccuracy}%</p>
              <p className="dashboard-card-subtitle">Last 30 days</p>
            </div>
          </div>
          <div className="dashboard-card-footer">
            <div className="dashboard-card-trend dashboard-card-trend-positive">
              <TrendingUp size={14} className="dashboard-card-trend-icon" />
              <span className="dashboard-card-trend-value">3.8%</span>
              <span className="dashboard-card-trend-label">since last month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Consumption Analysis</h2>
        </div>
        
        <div className="dashboard-stats-grid">
          <EnhancedSummaryStats data={summaryData} timePeriod={timePeriod} />
          
          <div className="summary-stats-container">
            <div className="summary-stats-header">
              <h3 className="summary-stats-title">Machine Consumption Breakdown</h3>
              <p className="summary-stats-subtitle">Percentage of total energy usage by machine</p>
            </div>
            
            <div className="summary-stats-chart-container">
              <MachineBreakdownChart />
            </div>
            
            <div className="summary-stats-footer">
              <div className="summary-stats-legend">
                <button className="dashboard-btn dashboard-btn-primary">
                  View Detailed Report <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Summary Stats Component
const EnhancedSummaryStats = ({ data, timePeriod }) => {
  const periodTitle = {
    week: 'Weekly',
    month: 'Monthly',
    year: 'Yearly'
  };

  return (
    <div className="summary-stats-container">
      <div className="summary-stats-header">
        <h3 className="summary-stats-title">{periodTitle[timePeriod]} Consumption Overview</h3>
        <p className="summary-stats-subtitle">Actual vs predicted energy usage</p>
      </div>
      
      <div className="summary-stats-chart-container">
        {/* Imagine this is the actual chart from your SummaryStats component */}
        <SummaryStatsChart data={data} />
      </div>
      
      <div className="summary-stats-footer">
        <div className="summary-stats-legend">
          <div className="summary-stats-legend-item">
            <div className="summary-stats-legend-color summary-stats-legend-actual"></div>
            <span>Actual</span>
          </div>
          <div className="summary-stats-legend-item">
            <div className="summary-stats-legend-color summary-stats-legend-predicted"></div>
            <span>Predicted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is a placeholder for the charts
// In your actual implementation, replace these with your real chart components
const SummaryStatsChart = ({ data }) => {
  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '0.875rem'
    }}>
      [Bar Chart Visualization - Replace with actual chart component]
    </div>
  );
};

const MachineBreakdownChart = () => {
  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '0.875rem'
    }}>
      [Pie Chart Visualization - Replace with actual chart component]
    </div>
  );
};

export default EnhancedDashboard;