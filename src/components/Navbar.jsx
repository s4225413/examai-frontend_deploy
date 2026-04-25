import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const LogoIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#g1)" />
    <path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="22" r="4" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
    <path d="M22.5 22l1 1 2-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <defs><linearGradient id="g1" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#7c2df8" /><stop offset="1" stopColor="#5a24b3" /></linearGradient></defs>
  </svg>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'instructor') return '/instructor';
    return '/dashboard';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <LogoIcon />
          ExamAI
        </Link>

        {user ? (
          <>
            <div className="navbar-links">
              <Link to={getDashboardLink()} className={location.pathname === getDashboardLink() ? 'active' : ''}>Dashboard</Link>
              {(user.role === 'student') && <Link to="/exams" className={location.pathname === '/exams' ? 'active' : ''}>Exams</Link>}
              {(user.role === 'student') && <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>Results</Link>}
              {(user.role === 'instructor') && <Link to="/create-exam" className={location.pathname === '/create-exam' ? 'active' : ''}>Create Exam</Link>}
              {(user.role === 'instructor') && <Link to="/question-bank" className={location.pathname === '/question-bank' ? 'active' : ''}>Question Bank</Link>}
              {(user.role === 'admin') && <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>Users</Link>}
              {(user.role === 'admin') && <Link to="/ai-logs" className={location.pathname === '/ai-logs' ? 'active' : ''}>Logs</Link>}
              <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
            </div>

            <div className="navbar-actions">
              <div className="navbar-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Search exams..." />
              </div>
              <div style={{ position: 'relative' }}>
                <div className="navbar-avatar" onClick={() => setShowDropdown(!showDropdown)}>
                  {getInitials(user.name)}
                </div>
                {showDropdown && (
                  <div className="navbar-dropdown">
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    <div className="divider" />
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile Settings</Link>
                    <Link to={getDashboardLink()} onClick={() => setShowDropdown(false)}>Dashboard</Link>
                    <div className="divider" />
                    <button onClick={() => { logout(); setShowDropdown(false); navigate('/'); }}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="navbar-actions">
            <div className="navbar-links">
              <Link to="/">Home</Link>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
