import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', university_id: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!agreed) { setError('Please agree to the Terms of Service'); return; }
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password, university_id: form.university_id, role: form.role });
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'instructor') navigate('/instructor');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our academic community and start your journey today.</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="reg-name" className="form-input" placeholder="John Doe" value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input id="reg-email" type="email" className="form-input" placeholder="name@university.edu" value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>
          </div>
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="reg-password" type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input id="reg-confirm" type="password" className="form-input" placeholder="••••••••" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
            </div>
          </div>
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label">University ID</label>
              <input id="reg-uid" className="form-input" placeholder="U-12345678" value={form.university_id} onChange={e => update('university_id', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Role Selection</label>
              <select id="reg-role" className="form-select" value={form.role} onChange={e => update('role', e.target.value)}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          </div>
          <div className="auth-checkbox">
            <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <label htmlFor="agree">I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</label>
          </div>
          <button id="reg-submit" type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login">Log in</Link></div>
        <div className="auth-trust">
          <span>🔒 SECURE REGISTRATION</span>
          <span>🏫 UNIVERSITY VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
