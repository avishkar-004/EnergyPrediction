// Enhanced Footer.jsx with more information and styling
import React from 'react';

// Import the layout CSS (assuming it's in a styles folder)
import '../../styles/layout.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-copyright">
        <p>&copy; {currentYear} Energy Consumption Prediction System</p>
      </div>
      
      <div className="footer-nav">
        <a href="#terms" className="footer-link">Terms of Service</a>
        <a href="#privacy" className="footer-link">Privacy Policy</a>
        <a href="#contact" className="footer-link">Contact</a>
      </div>
    </footer>
  );
};

// Alternative version - centered footer (use this if you prefer a simpler centered look)
const CenteredFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer centered">
      <p>&copy; {currentYear} Energy Consumption Prediction System</p>
    </footer>
  );
};

export default Footer;
// If you prefer the centered version, export it instead:
// export default CenteredFooter;