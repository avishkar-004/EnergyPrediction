// Enhanced ReportGenerator.jsx
import React, { useState, useEffect } from 'react';
import { fetchReportData, downloadReport } from '../../services/api';
import { format, subDays, subMonths } from 'date-fns';
import { FileText, Download, Calendar, CheckCircle, AlertTriangle, BarChart2, FileDown } from 'lucide-react';

const EnhancedReportGenerator = ({ machineIds, reportType }) => {
  const [reportConfig, setReportConfig] = useState({
    machineId: machineIds.length > 0 ? machineIds[0] : '',
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    reportType: 'daily',
    comparisonPeriod: 'previous' // 'previous', 'samePeriodLastYear'
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when report type changes
  useEffect(() => {
    // Adjust defaults based on selected report type
    if (reportType === 'consumption') {
      setReportConfig(prev => ({
        ...prev,
        reportType: 'daily'
      }));
    } else if (reportType === 'efficiency') {
      setReportConfig(prev => ({
        ...prev,
        reportType: 'daily'
      }));
    } else if (reportType === 'comparison') {
      setReportConfig(prev => ({
        ...prev,
        reportType: 'monthly',
        comparisonPeriod: 'previous'
      }));
    }
    
    // Clear previous report data
    setReportData(null);
  }, [reportType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickDateRange = (range) => {
    const today = new Date();
    let startDate;
    
    switch (range) {
      case 'lastWeek':
        startDate = subDays(today, 7);
        break;
      case 'lastMonth':
        startDate = subDays(today, 30);
        break;
      case 'lastQuarter':
        startDate = subDays(today, 90);
        break;
      case 'lastYear':
        startDate = subDays(today, 365);
        break;
      default:
        startDate = subDays(today, 30);
    }
    
    setReportConfig(prev => ({
      ...prev,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd')
    }));
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Add report type to the configuration
      const configWithType = {
        ...reportConfig,
        reportCategory: reportType
      };
      
      const data = await fetchReportData(configWithType);
      setReportData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again later.');
      setLoading(false);
    }
  };

  const handleDownload = async (fileFormat) => {
    try {
      await downloadReport({
        ...reportConfig,
        reportCategory: reportType,
        format: fileFormat
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again later.');
    }
  };

  // Calculate total and average consumption
  const calculateSummary = () => {
    if (!reportData || reportData.length === 0) return null;
    
    const totalConsumption = reportData.reduce((sum, item) => sum + item.consumption, 0);
    const avgConsumption = totalConsumption / reportData.length;
    const totalIdeal = reportData.reduce((sum, item) => sum + item.ideal, 0);
    
    // Calculate efficiency percentage
    const efficiencyPercentage = (totalIdeal / totalConsumption) * 100;
    
    // Determine efficiency status
    let efficiencyStatus = 'good';
    if (efficiencyPercentage < 85) {
      efficiencyStatus = 'bad';
    } else if (efficiencyPercentage < 90) {
      efficiencyStatus = 'warning';
    }
    
    return {
      totalConsumption: totalConsumption.toFixed(2),
      avgConsumption: avgConsumption.toFixed(2),
      efficiencyPercentage: efficiencyPercentage.toFixed(1),
      efficiencyStatus
    };
  };
  
  const summary = reportData ? calculateSummary() : null;

  return (
    <div className="report-form">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Machine
          </label>
          <select
            name="machineId"
            value={reportConfig.machineId}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="all">All Machines</option>
            {machineIds.map(id => (
              <option key={id} value={id}>Machine {id}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Start Date
          </label>
          <div className="flex items-center">
            <input
              type="date"
              name="startDate"
              value={reportConfig.startDate}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={reportConfig.endDate}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Report Type
          </label>
          <select
            name="reportType"
            value={reportConfig.reportType}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            {reportType === 'comparison' && (
              <option value="quarterly">Quarterly</option>
            )}
          </select>
        </div>
      </div>
      
      {/* Quick date selection buttons */}
      <div className="flex gap-2 mb-6">
        <button 
          type="button" 
          className="btn-sm action-button"
          onClick={() => handleQuickDateRange('lastWeek')}
        >
          <Calendar size={14} className="mr-1" />
          Last Week
        </button>
        <button 
          type="button" 
          className="btn-sm action-button"
          onClick={() => handleQuickDateRange('lastMonth')}
        >
          <Calendar size={14} className="mr-1" />
          Last Month
        </button>
        <button 
          type="button" 
          className="btn-sm action-button"
          onClick={() => handleQuickDateRange('lastQuarter')}
        >
          <Calendar size={14} className="mr-1" />
          Last Quarter
        </button>
        <button 
          type="button" 
          className="btn-sm action-button"
          onClick={() => handleQuickDateRange('lastYear')}
        >
          <Calendar size={14} className="mr-1" />
          Last Year
        </button>
      </div>
      
      {/* Comparison period selection (only for comparison reports) */}
      {reportType === 'comparison' && (
        <div className="mb-6">
          <label className="form-label">Comparison Period</label>
          <div className="flex gap-2">
            <label className="flex items-center p-3 border rounded cursor-pointer">
              <input
                type="radio"
                name="comparisonPeriod"
                value="previous"
                checked={reportConfig.comparisonPeriod === 'previous'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Previous Period
            </label>
            <label className="flex items-center p-3 border rounded cursor-pointer">
              <input
                type="radio"
                name="comparisonPeriod"
                value="samePeriodLastYear"
                checked={reportConfig.comparisonPeriod === 'samePeriodLastYear'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Same Period Last Year
            </label>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex items-center mb-6">
        <button
          onClick={generateReport}
          disabled={loading}
          className="btn btn-primary btn-icon"
        >
          {loading ? (
            <>
              <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <BarChart2 size={18} className="mr-2" />
              Generate Report
            </>
          )}
        </button>
      </div>
      
      {reportData && (
        <div className="report-results">
          <div className="report-header">
            <h2 className="report-title">
              {reportType === 'consumption' && 'Consumption Report'}
              {reportType === 'efficiency' && 'Efficiency Report'}
              {reportType === 'comparison' && 'Comparison Report'}
            </h2>
            <div className="report-actions">
              <button
                onClick={() => handleDownload('csv')}
                className="btn btn-sm btn-csv btn-icon"
              >
                <FileDown size={16} className="mr-1" />
                CSV
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="btn btn-sm btn-pdf btn-icon"
              >
                <FileDown size={16} className="mr-1" />
                PDF
              </button>
              <button
                onClick={() => handleDownload('excel')}
                className="btn btn-sm btn-excel btn-icon"
              >
                <FileDown size={16} className="mr-1" />
                Excel
              </button>
            </div>
          </div>
          
          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  {reportConfig.machineId === 'all' && (
                    <th>Machine</th>
                  )}
                  <th className="text-right">Consumption (kWh)</th>
                  <th className="text-right">Ideal (kWh)</th>
                  <th className="text-right">Difference (%)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    {reportConfig.machineId === 'all' && (
                      <td>{item.machine}</td>
                    )}
                    <td className="text-right">{item.consumption.toFixed(2)}</td>
                    <td className="text-right">{item.ideal.toFixed(2)}</td>
                    <td className="text-right">
                      <span className={
                        item.difference > 10 
                          ? 'diff-positive' 
                          : item.difference > 5 
                          ? 'diff-neutral' 
                          : 'diff-negative'
                      }>
                        {item.difference > 0 ? '+' : ''}{item.difference.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {summary && (
            <div className="report-summary">
              <h3 className="summary-title">Report Summary</h3>
              <div className="summary-stats">
                <div className="summary-stat">
                  <div className="summary-stat-label">Total Consumption</div>
                  <div className="summary-stat-value">{summary.totalConsumption} kWh</div>
                  <div className="summary-stat-secondary">For selected period</div>
                </div>
                <div className="summary-stat">
                  <div className="summary-stat-label">Average Consumption</div>
                  <div className="summary-stat-value">{summary.avgConsumption} kWh</div>
                  <div className="summary-stat-secondary">Per {reportConfig.reportType.slice(0, -2)}y</div>
                </div>
                <div className="summary-stat">
                  <div className="summary-stat-label">Efficiency Rating</div>
                  <div className="flex items-center">
                    <div className="summary-stat-value mr-2">{summary.efficiencyPercentage}%</div>
                    <span className={`status-badge status-${summary.efficiencyStatus}`}>
                      {summary.efficiencyStatus === 'good' && (
                        <CheckCircle size={12} className="mr-1 inline-block" />
                      )}
                      {summary.efficiencyStatus === 'warning' && (
                        <AlertTriangle size={12} className="mr-1 inline-block" />
                      )}
                      {summary.efficiencyStatus === 'bad' && (
                        <AlertTriangle size={12} className="mr-1 inline-block" />
                      )}
                      {summary.efficiencyStatus.charAt(0).toUpperCase() + summary.efficiencyStatus.slice(1)}
                    </span>
                  </div>
                  <div className="summary-stat-secondary">
                    {summary.efficiencyStatus === 'good' 
                      ? 'Excellent performance' 
                      : summary.efficiencyStatus === 'warning' 
                      ? 'Some optimization possible' 
                      : 'Needs improvement'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedReportGenerator;