// Enhanced ConsumptionGraph.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, subDays } from 'date-fns';
import { Calendar, Download, ZoomIn, ZoomOut } from 'lucide-react';

// Import CSS (if not already imported in parent)
import '../../styles/consumption-graphs.css';

const EnhancedConsumptionGraph = ({ pastData, predictionData, timeRange }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAverage, setShowAverage] = useState(false);
  
  // Format date according to time range
  const formatDateForRange = (dateString) => {
    const date = new Date(dateString);
    switch(timeRange) {
      case 'week':
        return format(date, 'EEE, MMM d');
      case 'year':
        return format(date, 'MMM yyyy');
      case 'month':
      default:
        return format(date, 'MMM dd');
    }
  };
  
  // Combine past and prediction data for the chart
  const chartData = [
    ...pastData.map(item => ({
      ...item,
      date: formatDateForRange(item.date),
      isPrediction: false
    })),
    ...predictionData.map(item => ({
      ...item,
      date: formatDateForRange(item.date),
      isPrediction: true
    }))
  ];
  
  // Calculate average consumption
  const averageConsumption = pastData.length > 0 
    ? pastData.reduce((sum, item) => sum + item.consumption, 0) / pastData.length 
    : 0;
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    if (zoomLevel < 2) setZoomLevel(zoomLevel + 0.25);
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.25);
  };
  
  // Export chart data to CSV
  const exportToCSV = () => {
    // Create CSV content
    const csvContent = [
      'Date,Actual Consumption (kWh),Predicted Consumption (kWh)',
      ...chartData.map(item => {
        return `${item.date},${item.consumption || ''},${item.prediction || ''}`;
      })
    ].join('\n');
    
    // Create and trigger download link
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `consumption_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="graph-container">
      <div className="graph-title">
        <div>
          Daily Energy Consumption (kWh)
          <span className="graph-subtitle">
            Showing actual vs predicted consumption
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="pagination-button" 
            onClick={() => setShowAverage(!showAverage)}
            title={showAverage ? "Hide average line" : "Show average line"}
          >
            <Calendar size={16} />
            <span className="ml-2">Avg</span>
          </button>
          
          <button 
            className="pagination-button" 
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          
          <button 
            className="pagination-button" 
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2}
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          
          <button 
            className="pagination-button" 
            onClick={exportToCSV}
            title="Export data as CSV"
          >
            <Download size={16} />
            <span className="ml-2">Export</span>
          </button>
        </div>
      </div>
      
      <div className="graph-chart-container" style={{ height: 400 * zoomLevel }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: '#D1D5DB' }}
              axisLine={{ stroke: '#D1D5DB' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: '#D1D5DB' }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickFormatter={(value) => `${value} kWh`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {showAverage && (
              <ReferenceLine 
                y={averageConsumption} 
                label={{ 
                  value: `Avg: ${averageConsumption.toFixed(2)} kWh`, 
                  position: 'insideBottomRight',
                  fill: '#6B7280',
                  fontSize: 12
                }} 
                stroke="#6B7280" 
                strokeDasharray="3 3" 
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="consumption" 
              name="Actual Consumption"
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Line 
              type="monotone" 
              dataKey="prediction" 
              name="Predicted Consumption"
              stroke="#10B981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#10B981', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationBegin={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color legend-actual"></div>
          <span>Actual Consumption</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-predicted"></div>
          <span>Predicted Consumption</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced custom tooltip with better styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isPrediction = payload[0]?.payload?.isPrediction;
    
    return (
      <div className="custom-tooltip">
        <div className="tooltip-label">{label}</div>
        
        {payload.map((entry, index) => {
          if (!entry.value) return null;
          
          return (
            <div key={`tooltip-item-${index}`} className="tooltip-item">
              <div 
                className="tooltip-color" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span>{entry.name}</span>
              <span className="tooltip-value">{entry.value.toFixed(2)} kWh</span>
            </div>
          );
        })}
        
        {isPrediction && (
          <div className="tooltip-prediction-badge">Prediction</div>
        )}
      </div>
    );
  }

  return null;
};

export default EnhancedConsumptionGraph;