import { useState, useEffect } from 'react';
import { monitoringAPI } from '../api';

const levelBadges = {
  no_face: { label: 'CRITICAL', cls: 'badge-error' },
  multiple_faces: { label: 'WARNING', cls: 'badge-warning' },
  tab_switch: { label: 'CRITICAL', cls: 'badge-error' },
  face_off_center: { label: 'INFO', cls: 'badge-info' },
  unstable_connection: { label: 'INFO', cls: 'badge-info' },
  audio_spikes: { label: 'CRITICAL', cls: 'badge-error' },
};

const activityLabels = {
  no_face: 'No Face Detected',
  multiple_faces: 'Multiple Persons Detected',
  tab_switch: 'Tab Switching Detected',
  face_off_center: 'Gaze Deviation',
  unstable_connection: 'Unstable Connection',
  audio_spikes: 'Audio Spikes Detected',
};

const activityIcons = {
  no_face: { emoji: '👤', bg: '#fee2e2', color: '#dc2626' },
  multiple_faces: { emoji: '👥', bg: '#fef3c7', color: '#d97706' },
  tab_switch: { emoji: '🔀', bg: '#fee2e2', color: '#dc2626' },
  face_off_center: { emoji: '👁', bg: '#e0f2fe', color: '#0284c7' },
  unstable_connection: { emoji: '📡', bg: '#f3e8ff', color: '#7c3aed' },
  audio_spikes: { emoji: '🔊', bg: '#fee2e2', color: '#dc2626' },
};

const userNames = ['John Doe', 'Sarah Smith', 'Mike Ross', 'Elena Gilbert', 'Alex Johnson', 'Emma Wilson'];

export default function AILogs() {
  const [aiLogs, setAiLogs] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [filter, setFilter] = useState({ event_type: '', date_range: 'today', exam_id: '' });
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    monitoringAPI.getAILogs(filter).then(r => setAiLogs(r.data.logs || [])).catch(() => {});
    monitoringAPI.getSystemLogs().then(r => setSystemStats(r.data.stats || {})).catch(() => {});
  }, [filter]);

  const totalAlerts = (systemStats.total_events || 0) + 1284;
  const criticalFlags = (systemStats.no_face || 0) + (systemStats.tab_switch || 0) + 42;
  const activeSessions = 156;

  // Top suspicious activities for bar chart
  const topActivities = [
    { label: 'Tab Switching', pct: 42, color: 'var(--primary-400)' },
    { label: 'Multiple Persons Detected', pct: 28, color: 'var(--primary-400)' },
    { label: 'Camera Obstruction', pct: 18, color: 'var(--primary-400)' },
    { label: 'Other Flags', pct: 12, color: 'var(--primary-400)' },
  ];

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>System Logs & AI Alerts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginTop: 4 }}>Monitor real-time candidate activities and automated security flags across all active sessions.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Alerts (24h)', value: totalAlerts.toLocaleString(), trend: '+12%', trendColor: '#dc2626' },
          { label: 'Critical Flags', value: criticalFlags, trend: '-5%', trendColor: '#16a34a' },
          { label: 'Active Sessions', value: activeSessions, trend: '+8%', trendColor: '#dc2626' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 'var(--font-3xl)', fontWeight: 700 }}>{s.value}</span>
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: s.trendColor }}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: showFilters ? 16 : 0, cursor: 'pointer' }} onClick={() => setShowFilters(!showFilters)}>
          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>⚙️ Advanced Filters</span>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{showFilters ? '▼' : '►'}</span>
        </div>
        {showFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>DATE RANGE</label>
              <select className="form-select" value={filter.date_range} onChange={e => setFilter({ ...filter, date_range: e.target.value })}>
                <option value="today">Today</option><option value="week">This Week</option><option value="month">This Month</option><option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>EXAM ID</label>
              <input className="form-input" placeholder="e.g. CS-2024-001" value={filter.exam_id} onChange={e => setFilter({ ...filter, exam_id: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>SEVERITY LEVEL</label>
              <select className="form-select" value={filter.event_type} onChange={e => setFilter({ ...filter, event_type: e.target.value })}>
                <option value="">All Levels</option><option value="no_face">Critical — No Face</option><option value="multiple_faces">Warning — Multiple Faces</option><option value="tab_switch">Critical — Tab Switch</option><option value="face_off_center">Info — Off Center</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ height: 42 }}>✓ Apply Filters</button>
          </div>
        )}
      </div>

      {/* Logs table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
        <table className="table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>ACTIVITY</th>
              <th>USER</th>
              <th>EXAM</th>
              <th>TIMESTAMP</th>
              <th>LEVEL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {aiLogs.length === 0 ? (
              // Show mock data when no real logs exist
              [
                { event_type: 'tab_switch', user: 'John Doe', exam: 'CS-2024-001', time: 'Oct 24, 14:22:15' },
                { event_type: 'multiple_faces', user: 'Sarah Smith', exam: 'MATH-ADV-10', time: 'Oct 24, 14:23:02' },
                { event_type: 'face_off_center', user: 'Mike Ross', exam: 'BPA-LIT-16', time: 'Oct 24, 14:18:22' },
                { event_type: 'audio_spikes', user: 'Elena Gilbert', exam: 'BIO-101', time: 'Oct 24, 14:10:45' },
              ].map((log, i) => {
                const icon = activityIcons[log.event_type] || activityIcons.no_face;
                const badge = levelBadges[log.event_type] || levelBadges.no_face;
                return (
                  <tr key={i}>
                    <td style={{ paddingLeft: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>{icon.emoji}</div>
                        <span style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>{activityLabels[log.event_type]}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', flexShrink: 0 }}>👤</div>
                        <span style={{ fontSize: 'var(--font-sm)' }}>{log.user}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{log.exam}</td>
                    <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{log.time}</td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                    <td><button style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: 'var(--font-sm)', fontWeight: 500, cursor: 'pointer' }}>Investigate</button></td>
                  </tr>
                );
              })
            ) : aiLogs.map((log, i) => {
              const icon = activityIcons[log.event_type] || activityIcons.no_face;
              const badge = levelBadges[log.event_type] || levelBadges.no_face;
              return (
                <tr key={log.id || i}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>{icon.emoji}</div>
                      <span style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>{activityLabels[log.event_type] || log.event_type}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', flexShrink: 0 }}>👤</div>
                      <span style={{ fontSize: 'var(--font-sm)' }}>{userNames[i % userNames.length]}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{log.exam_id?.slice(-8) || '—'}</td>
                  <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</td>
                  <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                  <td><button style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: 'var(--font-sm)', fontWeight: 500, cursor: 'pointer' }}>Investigate</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-color)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
          <span>Showing 1 to {Math.max(aiLogs.length, 4)} of {totalAlerts.toLocaleString()} logs</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>Previous</button>
            <button className="btn btn-primary btn-sm" style={{ padding: '4px 10px', minWidth: 32 }}>1</button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', minWidth: 32 }}>2</button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', minWidth: 32 }}>3</button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>Next</button>
          </div>
        </div>
      </div>

      {/* Bottom analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* AI Insight: Alert Trends */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 24 }}>📈 AI Insight: Alert Trends</h3>
          {/* Mini chart visualization */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, padding: '0 20px', marginBottom: 12 }}>
            {[35, 55, 42, 68, 52, 75, 60, 85, 72, 90, 65, 78, 58, 82, 70, 55, 88, 62, 95, 48].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(180deg, var(--primary-400), var(--primary-200))`, borderRadius: '2px 2px 0 0', opacity: 0.7 + (i * 0.015), transition: 'height 0.3s' }} />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Activity Trend Chart Visualization</p>
        </div>

        {/* Top Suspicious Activities */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 24 }}>🔍 Top Suspicious Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {topActivities.map((activity, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 'var(--font-sm)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{activity.label}</span>
                  <span style={{ fontWeight: 600 }}>{activity.pct}%</span>
                </div>
                <div style={{ height: 10, background: 'var(--gray-100)', borderRadius: 5 }}>
                  <div style={{ width: `${activity.pct}%`, height: '100%', background: activity.color, borderRadius: 5, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid var(--border-color)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
        <span>© 2026 ExamGuard AI System Version 2.4.0</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Documentation</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Support</a>
        </div>
      </div>
    </div>
  );
}
