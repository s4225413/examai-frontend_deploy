import { useState, useEffect } from 'react';
import { examsAPI, monitoringAPI } from '../api';

const studentNames = ['Marcus Chen', 'Sarah Jenkins', 'Liam Ortega', 'Emma Watson', 'Julian Rossi', 'Aisha Khan'];
const statuses = ['Normal', 'Warning', 'Normal', 'Normal', 'Suspicious', 'Normal'];
const alertLevels = ['Normal', 'Multiple Faces', 'Normal', 'Normal', 'Low Attention', 'Normal'];

export default function LiveMonitoring() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => { examsAPI.getAll().then(r => setExams(r.data.exams || [])).catch(() => {}); }, []);

  useEffect(() => {
    if (!selectedExam) return;
    const load = () => monitoringAPI.getLive(selectedExam).then(r => setStudents(r.data.students || [])).catch(() => {});
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selectedExam]);

  // Generate mock student cards for the UI
  const mockStudents = selectedExam ? studentNames.map((name, i) => ({
    name,
    status: statuses[i],
    alert: alertLevels[i],
    id: `STU-${String(i + 1).padStart(4, '0')}`,
    score: Math.floor(Math.random() * 30 + 70),
  })) : [];

  const filteredStudents = tab === 'all' ? mockStudents :
    tab === 'flagged' ? mockStudents.filter(s => s.status !== 'Normal') :
    tab === 'terminated' ? [] : mockStudents;

  const alerts = [
    { level: 'CRITICAL', color: '#dc2626', bg: '#fee2e2', name: 'Sarah Jenkins', desc: 'Multiple persons detected in camera frame for 5+ seconds', time: '2 min ago' },
    { level: 'CRITICAL', color: '#dc2626', bg: '#fee2e2', name: 'Julian Rossi', desc: 'System detected external device usage (Mobile Phone)', time: '5 min ago' },
    { level: 'ACTIVITY', color: '#d97706', bg: '#fef3c7', name: 'Aisha Khan', desc: 'Student reassured exam after temporary connection drop', time: '8 min ago' },
    { level: 'CRITICAL', color: '#dc2626', bg: '#fee2e2', name: 'Unknown Action', desc: 'Browser tab switching detected for student ID:99325', time: '12 min ago' },
  ];

  return (
    <div className="page-content animate-fade-in" style={{ padding: 0 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>ACTIVE SESSION</div>
          <div style={{ fontWeight: 600 }}>{selectedExam ? exams.find(e => e.id === selectedExam)?.title || 'Exam' : 'No exam selected'}</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>👥 {filteredStudents.length} Students Active</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="form-select" style={{ width: 280 }} value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
            <option value="">Choose an exam...</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 'calc(100vh - 180px)' }}>
        {/* Main area */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>Real-time Monitoring</h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Live views of current test takers</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm">🔲 Layout</button>
              <button className="btn btn-primary btn-sm">🔄 Sync All</button>
            </div>
          </div>

          {/* Sidebar filters */}
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ width: 160, flexShrink: 0 }}>
              {['all', 'flagged', 'terminated'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px',
                  border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--font-sm)',
                  fontWeight: tab === t ? 600 : 400, marginBottom: 4,
                  background: tab === t ? 'var(--primary-50)' : 'none', color: tab === t ? 'var(--primary-500)' : 'var(--text-secondary)',
                }}>
                  {t === 'all' ? '📡' : t === 'flagged' ? '🚩' : '⛔'} {t === 'all' ? 'All Feeds' : t === 'flagged' ? `Flagged (${mockStudents.filter(s => s.status !== 'Normal').length})` : 'Terminated'}
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 12, paddingTop: 12 }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>CONTROLS</div>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 4 }}>🔇 Global Mute</button>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--error-500)' }}>⏹ End Session Early</button>
              </div>
            </div>

            {/* Student grid */}
            <div style={{ flex: 1 }}>
              {!selectedExam ? (
                <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                  <p style={{ fontSize: '2rem', marginBottom: 8 }}>📹</p>
                  <p style={{ color: 'var(--text-muted)' }}>Select an exam to start monitoring</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {filteredStudents.map((s, i) => {
                    const isFlagged = s.status !== 'Normal';
                    return (
                      <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', border: isFlagged ? '2px solid var(--error-400)' : '1px solid var(--border-color)' }}>
                        {/* Webcam placeholder */}
                        <div style={{ height: 120, background: isFlagged ? 'linear-gradient(135deg, #1a1a2e, #2d1b4e)' : 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <span style={{ color: '#fff', fontSize: '2rem', opacity: 0.5 }}>👤</span>
                          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                            <span style={{ padding: '2px 8px', background: isFlagged ? 'var(--error-500)' : '#22c55e', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem', fontWeight: 600 }}>● LIVE</span>
                          </div>
                          {isFlagged && (
                            <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, padding: '6px 10px', background: 'rgba(220,38,38,0.85)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.65rem', fontWeight: 500 }}>
                              DETECTION: {s.alert}
                            </div>
                          )}
                        </div>
                        <div style={{ padding: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{s.name}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                            <span>Status: <span style={{ color: isFlagged ? 'var(--error-500)' : 'var(--success-500)', fontWeight: 600 }}>{s.status}</span></span>
                            <span style={{ fontWeight: 600, color: isFlagged ? 'var(--error-500)' : 'var(--primary-500)' }}>
                              {isFlagged ? 'Warning' : 'Secure'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts sidebar */}
        <div style={{ borderLeft: '1px solid var(--border-color)', padding: 20, background: 'var(--bg-primary)' }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 16 }}>🚨 Suspicious Activity Alerts</h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 16 }}>Real-time AI Analysis</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ padding: 12, border: `1px solid ${a.color}20`, borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${a.color}` }}>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: a.color, marginBottom: 4 }}>{a.level}</div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{a.desc}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button style={{ fontSize: 'var(--font-xs)', color: 'var(--primary-500)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>VIEW FEED</button>
                  <button style={{ fontSize: 'var(--font-xs)', color: 'var(--error-500)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>EVISIGE</button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>View All Logs</button>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 24px', borderTop: '1px solid var(--border-color)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>Session Health: <strong style={{ color: '#16a34a' }}>Stable</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>🟢 SERVER OPTIMAL</span>
          <span>🤖 AI ENGINE ACTIVE</span>
          <span>SESSION TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
