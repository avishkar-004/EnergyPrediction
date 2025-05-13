// Enhanced App.jsx with improved styling and functionality
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import ConsumptionGraphs from './pages/ConsumptionGraphs';
import IdealValues from './pages/IdealValues';
import Reports from './pages/Reports';
import Footer from './components/layout/Footer';

// Import CSS
import './styles/App.css';

// Inner component for accessing location
function MainContent() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  useEffect(() => {
    // Update page title based on current route
    switch(location.pathname) {
      case '/':
        setPageTitle('Energy Dashboard');
        break;
      case '/consumption-graphs':
        setPageTitle('Energy Consumption Analysis');
        break;
      case '/ideal-values':
        setPageTitle('Machine Ideal Values');
        break;
      case '/reports':
        setPageTitle('Energy Consumption Reports');
        break;
      default:
        setPageTitle('Energy Dashboard');
    }
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="app-main-container">
      <Navbar pageTitle={pageTitle} />
      <main className="app-main-content">
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/consumption-graphs" element={<ConsumptionGraphs />} />
            <Route path="/ideal-values" element={<IdealValues />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Detect screen size and auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      <div className={`app-flex-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Overlay for mobile sidebar */}
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
        <MainContent />
      </div>
    </Router>
  );
}

export default App;