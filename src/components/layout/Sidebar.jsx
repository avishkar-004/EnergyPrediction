// Enhanced Sidebar.jsx with active states and animations
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Table, FileText, ChevronLeft, Settings, HelpCircle } from 'lucide-react';

// Import the layout CSS (assuming it's in a styles folder)
import '../../styles/layout.css';

const Sidebar = ({ isOpen = true, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/consumption-graphs', icon: BarChart2, label: 'Consumption Graphs' },
    { path: '/ideal-values', icon: Table, label: 'Ideal Values' },
    { path: '/reports', icon: FileText, label: 'Reports' }
  ];

  return (
    <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">Energy Monitor</div>
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft size={18} style={{ 
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease'
          }} />
        </button>
      </div>
      
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">
                <item.icon size={20} />
              </span>
              <span className="sidebar-nav-text">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="sidebar-footer">
        <div className="sidebar-footer-content">
          {isOpen ? (
            <div className="sidebar-nav">
              <Link to="/settings" className="sidebar-nav-item">
                <span className="sidebar-nav-icon">
                  <Settings size={20} />
                </span>
                <span className="sidebar-nav-text">Settings</span>
              </Link>
              <Link to="/help" className="sidebar-nav-item">
                <span className="sidebar-nav-icon">
                  <HelpCircle size={20} />
                </span>
                <span className="sidebar-nav-text">Help & Support</span>
              </Link>
            </div>
          ) : (
            <>
              <button className="sidebar-nav-icon" aria-label="Settings">
                <Settings size={20} />
              </button>
              <button className="sidebar-nav-icon ml-3" aria-label="Help">
                <HelpCircle size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;