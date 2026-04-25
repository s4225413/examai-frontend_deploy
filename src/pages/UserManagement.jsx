import { useState, useEffect } from 'react';
import { adminAPI } from '../api';

const statusColors = { active: '#16a34a', suspended: '#d97706', pending: '#0ea5e9' };
const roleBadges = { admin: 'badge-primary', instructor: 'badge-info', student: 'badge-success', editor: 'badge-warning', viewer: 'badge-info' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => { loadUsers(); }, [search, roleFilter]);
  const loadUsers = () => { adminAPI.getUsers({ search, role: roleFilter }).then(r => setUsers(r.data.users || [])).catch(() => {}); };

  const handleRoleChange = async (userId, role) => {
    try { await adminAPI.updateRole(userId, role); loadUsers(); } catch { alert('Failed'); }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try { await adminAPI.deleteUser(userId); loadUsers(); } catch (e) { alert(e.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginTop: 4 }}>View and manage all registered users in your system.</p>
        </div>
        <button className="btn btn-primary btn-sm">+ Add New User</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by name, email or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 140 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">Role: All</option><option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>NAME</th>
              <th>ROLE</th>
              <th>EMAIL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td></tr>
            ) : users.map((u, i) => {
              const initials = u.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
              const colors = ['#7c3aed', '#0ea5e9', '#f59e0b', '#16a34a', '#ef4444', '#ec4899'];
              const bgColor = colors[i % colors.length];
              const status = i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'active';
              return (
                <tr key={u.id}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: bgColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                          {u.created_at ? `Last active ${Math.floor(Math.random() * 30 + 1)}m ago` : 'Created recently'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select className="form-select" style={{ width: 120, padding: '4px 8px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }} value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                      <option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>{u.email}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-sm)', color: statusColors[status], fontWeight: 500 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[status] }} />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} title="Edit">✏️</button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} title="View">👁</button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--error-500)' }} title="Delete" onClick={() => handleDelete(u.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-color)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            <span>Showing 1 to {users.length} of {users.length} users</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>Previous</button>
              <button className="btn btn-primary btn-sm" style={{ padding: '4px 10px', minWidth: 32 }}>1</button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', minWidth: 32 }}>2</button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', minWidth: 32 }}>3</button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
