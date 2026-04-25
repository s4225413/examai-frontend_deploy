import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', university_id: user?.university_id || '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      setMsg('Profile updated!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { setMsg('Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    try {
      await authAPI.changePassword(pwForm);
      setMsg('Password changed!');
      setPwForm({ current_password: '', new_password: '' });
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { setMsg(e.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header"><h1>Profile Settings</h1><p>Manage your account details</p></div>
      {msg && <div style={{ padding: '10px 16px', background: msg.includes('fail') ? '#fee2e2' : '#dcfce7', borderRadius: 'var(--radius-md)', marginBottom: 16, fontSize: 'var(--font-sm)', fontWeight: 500 }}>{msg}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-2xl)', fontWeight: 700, margin: '0 auto 16px' }}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h3 style={{ fontWeight: 600, fontSize: 'var(--font-lg)' }}>{user?.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>{user?.email}</p>
          <span className="badge badge-primary" style={{ marginTop: 8 }}>{user?.role}</span>
          <div style={{ marginTop: 16, padding: '12px 0', borderTop: '1px solid var(--border-color)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 16 }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">University ID</label>
                <input className="form-input" value={form.university_id} onChange={e => update('university_id', e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 16 }}>Change Password</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" value={pwForm.current_password} onChange={e => setPwForm(p => ({ ...p, current_password: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={pwForm.new_password} onChange={e => setPwForm(p => ({ ...p, new_password: e.target.value }))} />
              </div>
            </div>
            <button className="btn btn-secondary" onClick={handlePasswordChange}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
