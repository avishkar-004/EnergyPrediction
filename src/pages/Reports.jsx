// Enhanced Reports.jsx
import React, { useState, useEffect } from 'react';
import EnhancedReportGenerator from '../components/reports/ReportGenerator';
import { fetchMachineIds } from '../services/api';
import { BarChart, FileText, Calendar, Cpu } from 'lucide-react';

// Import CSS
import '../styles/reports.css';

const EnhancedReports = () => {
  const [machineIds, setMachineIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState('consumption'); // 'consumption', 'efficiency', 'comparison'

  useEffect(() => {
    const loadMachineIds = async () => {
      try {
        setLoading(true);
        const ids = await fetchMachineIds();
        setMachineIds(ids);
        setLoading(false);
      } catch (error) {
        console.error('Error loading machine IDs:', error);
        setLoading(false);
      }
    };

    loadMachineIds();
  }, []);

  const handleReportTypeChange = (reportType) => {
    setSelectedReportType(reportType);
  };

  return (
    <div className="reports-page">
      <div className="reports-card">
        <h1 className="reports-title">Energy Consumption Reports</h1>
        <p className="reports-subtitle">
          Generate and download detailed reports about energy consumption and efficiency
        </p>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading machine data...</div>
          </div>
        ) : (
          <>
            <div className="report-types">
              <div 
                className={`report-type-card ${selectedReportType === 'consumption' ? 'active' : ''}`}
                onClick={() => handleReportTypeChange('consumption')}
              >
                <div className="report-type-header">
                  <div className="report-type-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <BarChart size={24} />
                  </div>
                  <div className="report-type-title">Consumption Report</div>
                </div>
                <div className="report-type-description">
                  Daily, weekly, or monthly energy consumption patterns and statistics
                </div>
              </div>
              
              <div 
                className={`report-type-card ${selectedReportType === 'efficiency' ? 'active' : ''}`}
                onClick={() => handleReportTypeChange('efficiency')}
              >
                <div className="report-type-header">
                  <div className="report-type-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <Cpu size={24} />
                  </div>
                  <div className="report-type-title">Efficiency Report</div>
                </div>
                <div className="report-type-description">
                  Compare actual consumption with ideal values to assess efficiency
                </div>
              </div>
              
              <div 
                className={`report-type-card ${selectedReportType === 'comparison' ? 'active' : ''}`}
                onClick={() => handleReportTypeChange('comparison')}
              >
                <div className="report-type-header">
                  <div className="report-type-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                    <Calendar size={24} />
                  </div>
                  <div className="report-type-title">Comparison Report</div>
                </div>
                <div className="report-type-description">
                  Compare energy consumption across different time periods
                </div>
              </div>
            </div>
            
            <EnhancedReportGenerator 
              machineIds={machineIds}
              reportType={selectedReportType}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedReports;