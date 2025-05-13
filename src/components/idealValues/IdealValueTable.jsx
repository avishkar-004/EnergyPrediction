// Enhanced IdealValueTable.jsx
import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Download, Filter, ChevronDown, Settings, Check, X, AlertTriangle } from 'lucide-react';

const EnhancedIdealValueTable = ({ idealValues, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'machineId',
    direction: 'ascending'
  });
  const [statusFilter, setStatusFilter] = useState('all'); // all, optimal, warning, critical
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const getFilteredAndSortedData = () => {
    return [...idealValues]
      .filter(item => {
        // Apply search filter
        const matchesSearch = 
          item.machineId.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.machineName.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Apply status filter
        const matchesStatus = 
          statusFilter === 'all' || 
          item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
  };

  const filteredAndSortedData = getFilteredAndSortedData();

  // Get the appropriate sort indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="sort-indicator">
        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
      </span>
    );
  };
  
  // Handle refresh action
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };
  
  // Export data to CSV
  const exportToCSV = () => {
    // Create CSV content
    const csvContent = [
      'Machine ID,Machine Name,Ideal Consumption (kWh),Tolerance (%),Status',
      ...filteredAndSortedData.map(item => 
        `"${item.machineId}","${item.machineName}",${item.idealConsumption.toFixed(2)},${item.tolerancePercentage},"${item.status}"`
      )
    ].join('\n');
    
    // Create and trigger download link
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ideal_values_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Toggle filter menu
  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };
  
  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterDropdown = document.getElementById('filter-dropdown');
      if (filterDropdown && !filterDropdown.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="table-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Machine ID or Name..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="search-icon" />
        </div>
        
        <div className="action-buttons">
          <div id="filter-dropdown" className="filter-dropdown">
            <button className="action-button" onClick={toggleFilterMenu}>
              <Filter size={16} />
              {statusFilter !== 'all' && (
                <span className="ml-1 capitalize">{statusFilter}</span>
              )}
              <ChevronDown size={14} className="ml-2" />
            </button>
            
            {showFilterMenu && (
              <div className="filter-dropdown-menu">
                <div 
                  className={`filter-dropdown-item ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('all'); setShowFilterMenu(false); }}
                >
                  {statusFilter === 'all' && <Check size={16} />}
                  <span className="ml-1">All Status</span>
                </div>
                <div 
                  className={`filter-dropdown-item ${statusFilter === 'optimal' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('optimal'); setShowFilterMenu(false); }}
                >
                  {statusFilter === 'optimal' && <Check size={16} />}
                  <span className="ml-1">Optimal</span>
                </div>
                <div 
                  className={`filter-dropdown-item ${statusFilter === 'warning' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('warning'); setShowFilterMenu(false); }}
                >
                  {statusFilter === 'warning' && <Check size={16} />}
                  <span className="ml-1">Warning</span>
                </div>
                <div 
                  className={`filter-dropdown-item ${statusFilter === 'critical' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('critical'); setShowFilterMenu(false); }}
                >
                  {statusFilter === 'critical' && <Check size={16} />}
                  <span className="ml-1">Critical</span>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="action-button" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span className="ml-1">Refresh</span>
          </button>
          
          <button 
            className="action-button" 
            onClick={exportToCSV}
            disabled={filteredAndSortedData.length === 0}
          >
            <Download size={16} />
            <span className="ml-1">Export</span>
          </button>
          
          <button className="action-button action-button-primary">
            <Settings size={16} />
            <span className="ml-1">Manage Settings</span>
          </button>
        </div>
      </div>

      <div className="ideal-value-table-container">
        <table className="ideal-value-table">
          <thead>
            <tr>
              <th 
                onClick={() => requestSort('machineId')}
                className={sortConfig.key === 'machineId' ? 'sorted' : ''}
              >
                Machine ID {getSortDirectionIndicator('machineId')}
              </th>
              <th 
                onClick={() => requestSort('machineName')}
                className={sortConfig.key === 'machineName' ? 'sorted' : ''}
              >
                Machine Name {getSortDirectionIndicator('machineName')}
              </th>
              <th 
                onClick={() => requestSort('idealConsumption')}
                className={sortConfig.key === 'idealConsumption' ? 'sorted' : ''}
                style={{ textAlign: 'right' }}
              >
                Ideal Consumption (kWh) {getSortDirectionIndicator('idealConsumption')}
              </th>
              <th 
                onClick={() => requestSort('tolerancePercentage')}
                className={sortConfig.key === 'tolerancePercentage' ? 'sorted' : ''}
                style={{ textAlign: 'right' }}
              >
                Tolerance (%) {getSortDirectionIndicator('tolerancePercentage')}
              </th>
              <th 
                onClick={() => requestSort('status')}
                className={sortConfig.key === 'status' ? 'sorted' : ''}
                style={{ textAlign: 'center' }}
              >
                Status {getSortDirectionIndicator('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item) => (
              <tr key={item.id}>
                <td>{item.machineId}</td>
                <td>{item.machineName}</td>
                <td style={{ textAlign: 'right' }}>{item.idealConsumption.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{item.tolerancePercentage}%</td>
                <td style={{ textAlign: 'center' }}>
                  <span 
                    className={`status-badge ${
                      item.status === 'optimal' 
                        ? 'status-optimal' 
                        : item.status === 'warning'
                        ? 'status-warning'
                        : 'status-critical'
                    }`}
                  >
                    {item.status === 'optimal' && <Check size={14} className="mr-1" />}
                    {item.status === 'warning' && <AlertTriangle size={14} className="mr-1" />}
                    {item.status === 'critical' && <X size={14} className="mr-1" />}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">
            No matching machines found. Try adjusting your search or filters.
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-500 mt-2">
        Showing {filteredAndSortedData.length} of {idealValues.length} machines
      </div>
    </div>
  );
};

export default EnhancedIdealValueTable;