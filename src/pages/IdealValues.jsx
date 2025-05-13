// Enhanced IdealValues.jsx
import React, { useEffect, useState } from 'react';
import EnhancedIdealValueTable from '../components/idealValues/IdealValueTable';
import { fetchIdealValues } from '../services/api';
import { CheckCircle, AlertTriangle, AlertCircle, Cpu } from 'lucide-react';

// Import CSS
import '../styles/ideal-values.css';

const EnhancedIdealValues = () => {
  const [idealValues, setIdealValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    optimal: 0,
    warning: 0,
    critical: 0
  });

  useEffect(() => {
    const loadIdealValues = async () => {
      try {
        setLoading(true);
        const data = await fetchIdealValues();
        setIdealValues(data);
        
        // Calculate stats
        const totalMachines = data.length;
        const optimalCount = data.filter(item => item.status === 'optimal').length;
        const warningCount = data.filter(item => item.status === 'warning').length;
        const criticalCount = data.filter(item => item.status === 'critical').length;
        
        setStats({
          total: totalMachines,
          optimal: optimalCount,
          warning: warningCount,
          critical: criticalCount
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading ideal values:', error);
        setLoading(false);
      }
    };

    loadIdealValues();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await fetchIdealValues();
      setIdealValues(data);
      
      // Recalculate stats
      const totalMachines = data.length;
      const optimalCount = data.filter(item => item.status === 'optimal').length;
      const warningCount = data.filter(item => item.status === 'warning').length;
      const criticalCount = data.filter(item => item.status === 'critical').length;
      
      setStats({
        total: totalMachines,
        optimal: optimalCount,
        warning: warningCount,
        critical: criticalCount
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing ideal values:', error);
      setLoading(false);
    }
  };

  return (
    <div className="ideal-values-page">
      <div className="ideal-values-card">
        <h1 className="ideal-values-title">Machine Ideal Consumption Values</h1>
        <p className="ideal-values-subtitle">
          View and manage the optimal energy consumption settings for all machines
        </p>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading ideal values...</div>
          </div>
        ) : (
          <>
            <div className="status-summary">
              <div className="summary-card">
                <div className="summary-icon summary-icon-total">
                  <Cpu size={20} />
                </div>
                <div className="summary-content">
                  <div className="summary-label">Total Machines</div>
                  <div className="summary-value">{stats.total}</div>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon summary-icon-optimal">
                  <CheckCircle size={20} />
                </div>
                <div className="summary-content">
                  <div className="summary-label">Optimal</div>
                  <div className="summary-value">{stats.optimal}</div>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon summary-icon-warning">
                  <AlertTriangle size={20} />
                </div>
                <div className="summary-content">
                  <div className="summary-label">Warning</div>
                  <div className="summary-value">{stats.warning}</div>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon summary-icon-critical">
                  <AlertCircle size={20} />
                </div>
                <div className="summary-content">
                  <div className="summary-label">Critical</div>
                  <div className="summary-value">{stats.critical}</div>
                </div>
              </div>
            </div>
            
            <EnhancedIdealValueTable 
              idealValues={idealValues} 
              onRefresh={handleRefresh}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedIdealValues;