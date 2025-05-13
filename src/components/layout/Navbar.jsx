// Enhanced Navbar.jsx with improved styling and active state
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell, User, Settings } from 'lucide-react';

// Import the layout CSS (assuming it's in a styles folder)
import '../../styles/layout.css';

const Navbar = ({ pageTitle, toggleSidebar }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'shadow' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <button
            onClick={toggleSidebar}
            className="navbar-toggle mr-4"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          <h1 className="navbar-logo">
            {pageTitle || "Energy Consumption Prediction System"}
          </h1>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-nav hidden-mobile">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/consumption-graphs" 
              className={`nav-link ${location.pathname === '/consumption-graphs' ? 'active' : ''}`}
            >
              Consumption Graphs
            </Link>
            <Link 
              to="/ideal-values" 
              className={`nav-link ${location.pathname === '/ideal-values' ? 'active' : ''}`}
            >
              Ideal Values
            </Link>
            <Link 
              to="/reports" 
              className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
            >
              Reports
            </Link>
          </div>
          
          <div className="navbar-actions">
            <button className="navbar-action-btn has-badge" aria-label="Notifications">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="badge">{notifications > 9 ? '9+' : notifications}</span>
              )}
            </button>
            
            <button className="navbar-action-btn" aria-label="Settings">
              <Settings size={18} />
            </button>
            
            <button className="navbar-action-btn" aria-label="User profile">
              <User size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;