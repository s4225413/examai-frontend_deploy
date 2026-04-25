import { useState, useEffect } from 'react';
import { adminAPI, monitoringAPI } from '../api';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data.stats || {})).catch(() => {});
    monitoringAPI.getSystemLogs().then(r => setLogs(r.data.logs || [])).catch(() => {});
  }, []);

  const auditLogs = [
    { icon: '✅', title: 'Login attempt successful', desc: `User: admin@system.com • IP: 192.168.1.10`, time: '3 MINUTES AGO', color: '#dcfce7' },
    { icon: '⚙️', title: 'System configuration updated', desc: 'Module: Security Settings • Changes by: ID_32643', time: '10 MINUTES AGO', color: '#e0f2fe' },
    { icon: '🛡️', title: 'Unauthorized access blocked', desc: 'Origin: External API • Attempt: Root Login', time: '1 HOUR AGO', color: '#fee2e2' },
    { icon: '💾', title: 'Database Backup Completed', desc: 'File: db_backup_2026.04.24.sql • Size: 42 GB', time: '6 HOURS AGO', color: '#f3e8ff' },
  ];

  // System health metrics
  const dbPerf = 96;
  const cpuLoad = 24;
  const memUsage = 42;

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>System Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginTop: 4 }}>Real-time monitoring and global security analytics.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} value={stats.total_users || 0} label="Total Users" trend="+12%" color="purple" />
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>} value={stats.total_exams || 0} label="Active Exams" trend="-5%" trendDir="down" color="blue" />
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} value={stats.total_proctor_events || 0} label="Security Alerts" trend="-2%" trendDir="down" color="red" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* System Health */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600 }}>🖥 System Health</h3>
            <span className="badge badge-success">Stable</span>
          </div>

          {[
            { label: 'Database Performance', value: dbPerf, color: '#22c55e' },
            { label: 'Server CPU Load', value: cpuLoad, color: '#0ea5e9' },
            { label: 'Memory Usage', value: memUsage, color: memUsage > 70 ? '#ef4444' : '#f59e0b' },
          ].map((m, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 'var(--font-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                <span style={{ fontWeight: 600 }}>{m.value}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--gray-200)', borderRadius: 4 }}>
                <div style={{ width: `${m.value}%`, height: '100%', background: m.color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>UPTIME</div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: '#16a34a' }}>99.9%</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AVG LATENCY</div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>124ms</div>
            </div>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600 }}>📋 Recent Audit Logs</h3>
            <a href="#" style={{ fontSize: 'var(--font-sm)', color: 'var(--primary-500)', fontWeight: 500, textDecoration: 'none' }}>View All</a>
          </div>

          {auditLogs.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < auditLogs.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: log.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{log.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{log.title}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{log.desc}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Stats */}
      <div className="card">
        <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 20 }}>📊 Platform Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Questions', value: stats.total_questions || 0, icon: '❓', color: 'var(--primary-500)' },
            { label: 'Total Submissions', value: stats.total_submissions || 0, icon: '📝', color: 'var(--success-500)' },
            { label: 'Students', value: stats.total_students || 0, icon: '🎓', color: 'var(--accent-500)' },
            { label: 'Instructors', value: stats.total_instructors || 0, icon: '👨‍🏫', color: 'var(--warning-500)' },
          ].map((item, i) => (
            <div key={i} style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
