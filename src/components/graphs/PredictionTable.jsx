// Enhanced PredictionTable.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Download, Search, Filter } from 'lucide-react';

// Import CSS (if not already imported in parent)
import '../../styles/consumption-graphs.css';

const EnhancedPredictionTable = ({ pastData, predictionData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filterType, setFilterType] = useState('all'); // 'all', 'actual', 'prediction'

  // Format and combine data for the table
  const formatTableData = () => {
    const past = pastData.map(item => ({
      date: new Date(item.date),
      formattedDate: format(new Date(item.date), 'MMM dd, yyyy'),
      consumption: item.consumption.toFixed(2),
      prediction: '-',
      difference: '-',
      isPrediction: false
    }));

    const predictions = predictionData.map(item => {
      // Find matching past data for the same date (if any)
      const matchingPast = pastData.find(p => 
        format(new Date(p.date), 'yyyy-MM-dd') === format(new Date(item.date), 'yyyy-MM-dd')
      );
      
      let difference = '-';
      if (matchingPast) {
        const diff = ((item.prediction - matchingPast.consumption) / matchingPast.consumption) * 100;
        difference = `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
      }
      
      return {
        date: new Date(item.date),
        formattedDate: format(new Date(item.date), 'MMM dd, yyyy'),
        consumption: matchingPast ? matchingPast.consumption.toFixed(2) : '-',
        prediction: item.prediction.toFixed(2),
        difference,
        isPrediction: true
      };
    });

    // Return combined data
    return [...past, ...predictions];
  };

  const tableData = formatTableData();
  
  // Filter data based on search term and filter type
  const filteredData = tableData.filter(item => {
    const matchesSearch = item.formattedDate.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'actual') return matchesSearch && !item.isPrediction;
    if (filterType === 'prediction') return matchesSearch && item.isPrediction;
    
    return matchesSearch;
  });
  
  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? a.date - b.date
        : b.date - a.date;
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  
  // Request sort when header is clicked
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Export table data to CSV
  const exportToCSV = () => {
    // Create CSV content
    const csvContent = [
      'Date,Actual Consumption (kWh),Predicted Consumption (kWh),Difference (%)',
      ...tableData.map(item => {
        return `"${item.formattedDate}",${item.consumption === '-' ? '' : item.consumption},${item.prediction === '-' ? '' : item.prediction},${item.difference === '-' ? '' : item.difference}`;
      })
    ].join('\n');
    
    // Create and trigger download link
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `consumption_table_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get the sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Consumption Data</h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="machine-select pl-8"
              style={{ width: '200px' }}
            />
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="machine-select"
            style={{ width: '120px' }}
          >
            <option value="all">All Data</option>
            <option value="actual">Actual Only</option>
            <option value="prediction">Predictions</option>
          </select>
          
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
      
      <div className="table-container">
        <table className="prediction-table">
          <thead>
            <tr>
              <th 
                onClick={() => requestSort('date')}
                style={{ cursor: 'pointer' }}
              >
                Date{getSortDirectionIndicator('date')}
              </th>
              <th 
                onClick={() => requestSort('consumption')}
                style={{ cursor: 'pointer', textAlign: 'right' }}
              >
                Actual (kWh){getSortDirectionIndicator('consumption')}
              </th>
              <th 
                onClick={() => requestSort('prediction')}
                style={{ cursor: 'pointer', textAlign: 'right' }}
              >
                Predicted (kWh){getSortDirectionIndicator('prediction')}
              </th>
              <th style={{ textAlign: 'right' }}>
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr 
                  key={index} 
                  className={item.isPrediction ? "prediction-row" : ""}
                >
                  <td>
                    {item.formattedDate}
                    {item.isPrediction && (
                      <span className="prediction-badge">
                        Prediction
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={item.consumption !== '-' ? "table-value table-value-actual" : ""}>
                      {item.consumption}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={item.prediction !== '-' ? "table-value table-value-predicted" : ""}>
                      {item.prediction}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {item.difference !== '-' && (
                      <span className={`table-value ${
                        item.difference.startsWith('+') 
                          ? 'text-red-500' 
                          : item.difference === '0.0%' 
                            ? 'text-gray-500' 
                            : 'text-green-500'
                      }`}>
                        {item.difference}
                      </span>
                    )}
                    {item.difference === '-' && '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  No data found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
          className="machine-select"
          style={{ width: '80px' }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        
        <span className="pagination-info">
          Showing {sortedData.length > 0 ? startIndex + 1 : 0}-
          {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} entries
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <ChevronLeft size={16} />
        </button>
        
        <span className="pagination-info">
          Page {currentPage} of {totalPages || 1}
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="pagination-button"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default EnhancedPredictionTable;