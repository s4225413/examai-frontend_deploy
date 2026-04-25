import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>ExamAI</h3>
          <p>Secure AI-Powered Online Examination Platform with advanced proctoring and integrity monitoring.</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <Link to="/">Home</Link>
          <Link to="/exams">Exams</Link>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href="#careers">Careers</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/help">Help Center</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 ExamAI. All rights reserved.</span>
        <span>Built with AI-powered technology</span>
      </div>
    </footer>
  );
}
