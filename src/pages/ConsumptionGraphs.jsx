// Enhanced ConsumptionGraphs.jsx
import React, { useState, useEffect } from 'react';
import { fetchMachineIds, fetchMachineConsumptionData } from '../services/api';
import EnhancedConsumptionGraph from '../components/graphs/ConsumptionGraph';
import EnhancedPredictionTable from '../components/graphs/PredictionTable';
import { TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react';

// Import CSS
import '../styles/consumption-graphs.css';

const EnhancedConsumptionGraphs = () => {
  const [machineIds, setMachineIds] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [consumptionData, setConsumptionData] = useState({
    past: [],
    prediction: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadMachineIds = async () => {
      try {
        const ids = await fetchMachineIds();
        setMachineIds(ids);
        if (ids.length > 0) {
          setSelectedMachineId(ids[0]);
        }
      } catch (error) {
        console.error('Error loading machine IDs:', error);
      }
    };

    loadMachineIds();
  }, []);

  useEffect(() => {
    const loadConsumptionData = async () => {
      if (!selectedMachineId) return;

      setLoading(true);
      try {
        // In a real app, you would pass timeRange to your API
        const data = await fetchMachineConsumptionData(selectedMachineId);
        setConsumptionData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading consumption data:', error);
        setLoading(false);
      }
    };

    loadConsumptionData();
  }, [selectedMachineId, timeRange]);

  const handleMachineChange = (e) => {
    setSelectedMachineId(e.target.value);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleRefresh = async () => {
    if (refreshing || !selectedMachineId) return;
    
    setRefreshing(true);
    try {
      const data = await fetchMachineConsumptionData(selectedMachineId);
      setConsumptionData(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate some summary statistics for our data cards
  const calculateStats = () => {
    if (!consumptionData.past || consumptionData.past.length === 0) {
      return {
        avgConsumption: 0,
        maxConsumption: 0,
        avgPrediction: 0,
        trend: 0
      };
    }

    const totalConsumption = consumptionData.past.reduce((sum, item) => sum + item.consumption, 0);
    const avgConsumption = totalConsumption / consumptionData.past.length;
    
    const maxConsumption = Math.max(...consumptionData.past.map(item => item.consumption));
    
    const totalPrediction = consumptionData.prediction.reduce((sum, item) => sum + item.prediction, 0);
    const avgPrediction = totalPrediction / consumptionData.prediction.length;
    
    // Calculate trend (difference between average predicted and average actual)
    const trend = avgPrediction - avgConsumption;
    const trendPercentage = (trend / avgConsumption) * 100;
    
    return {
      avgConsumption: avgConsumption.toFixed(2),
      maxConsumption: maxConsumption.toFixed(2),
      avgPrediction: avgPrediction.toFixed(2),
      trend: trendPercentage.toFixed(1)
    };
  };

  const stats = calculateStats();

  return (
    <div className="consumption-page">
      <div className="consumption-card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="consumption-title">Energy Consumption Analysis</h1>
          
          <div className="time-filter">
            <div 
              className={`time-filter-option ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('week')}
            >
              Week
            </div>
            <div 
              className={`time-filter-option ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('month')}
            >
              Month
            </div>
            <div 
              className={`time-filter-option ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('year')}
            >
              Year
            </div>
          </div>
        </div>
        
        <div className="machine-selector">
          <label htmlFor="machineSelect" className="machine-selector-label">
            Select Machine
          </label>
          <div className="flex items-center">
            <select
              id="machineSelect"
              value={selectedMachineId}
              onChange={handleMachineChange}
              className="machine-select"
              disabled={loading}
            >
              {machineIds.map((id) => (
                <option key={id} value={id}>
                  Machine ID: {id}
                </option>
              ))}
            </select>
            
            <button 
              className="ml-2 pagination-button" 
              onClick={handleRefresh}
              disabled={refreshing || loading}
              title="Refresh data"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading consumption data...</div>
          </div>
        ) : (
          <>
            <div className="data-cards">
              <div className="data-card">
                <div className="data-card-title">Average Consumption</div>
                <div className="data-card-value">
                  {stats.avgConsumption}<span className="data-card-unit">kWh</span>
                </div>
                <div className="data-card-trend">
                  <Calendar size={14} /> Last {timeRange}
                </div>
              </div>
              
              <div className="data-card">
                <div className="data-card-title">Peak Consumption</div>
                <div className="data-card-value">
                  {stats.maxConsumption}<span className="data-card-unit">kWh</span>
                </div>
                <div className="data-card-trend">
                  <Calendar size={14} /> Last {timeRange}
                </div>
              </div>
              
              <div className="data-card">
                <div className="data-card-title">Average Predicted</div>
                <div className="data-card-value">
                  {stats.avgPrediction}<span className="data-card-unit">kWh</span>
                </div>
                <div className="data-card-trend">
                  <Calendar size={14} /> Next period
                </div>
              </div>
              
              <div className="data-card">
                <div className="data-card-title">Consumption Trend</div>
                <div className="data-card-value">
                  {stats.trend}%
                </div>
                <div className={`data-card-trend ${parseFloat(stats.trend) >= 0 ? 'data-card-trend-positive' : 'data-card-trend-negative'}`}>
                  {parseFloat(stats.trend) >= 0 ? (
                    <><TrendingUp size={14} /> Increasing</>
                  ) : (
                    <><TrendingDown size={14} /> Decreasing</>
                  )}
                </div>
              </div>
            </div>
            
            <EnhancedConsumptionGraph 
              pastData={consumptionData.past} 
              predictionData={consumptionData.prediction} 
              timeRange={timeRange}
            />
            
            <EnhancedPredictionTable 
              pastData={consumptionData.past} 
              predictionData={consumptionData.prediction} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedConsumptionGraphs;