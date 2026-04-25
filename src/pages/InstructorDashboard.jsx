import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examsAPI, submissionsAPI } from '../api';
import StatsCard from '../components/StatsCard';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    examsAPI.getAll().then(r => setExams(r.data.exams || [])).catch(() => {});
  }, []);

  const published = exams.filter(e => e.status === 'published').length;
  const active = exams.filter(e => e.status === 'active').length;
  const avgScore = 82.4;

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginTop: 4 }}>Welcome back, here is what's happening with your courses today.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">📤 Export Report</button>
          <Link to="/create-exam" className="btn btn-primary btn-sm">+ Create New</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>} value={exams.length} label="Total Exams" trend="+2.4%" color="purple" />
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} value="1,240" label="Students Registered" trend="+15.2%" color="red" />
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} value={`${avgScore}%`} label="Average Score" trend="-0.8%" trendDir="down" color="yellow" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Quick Actions */}
        <div>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>⚡ Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { icon: '📝', label: 'Create Exam', to: '/create-exam' },
              { icon: '❓', label: 'Question Bank', to: '/question-bank' },
              { icon: '📹', label: 'Live Monitoring', to: '/monitoring' },
            ].map((a, i) => (
              <Link key={i} to={a.to} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ textAlign: 'center', padding: 20, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{a.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 16 }}>🔔 Recent Alerts</h3>
          {[
            { icon: '🔴', title: 'Potential Plagiarism Detected', desc: 'Student Marcus V. in Advanced Calculus II', color: '#fee2e2' },
            { icon: '🔵', title: 'Exams Scheduled', desc: 'Biology Final and Chemistry Quiz updated', color: '#e0f2fe' },
            { icon: '🟡', title: 'Grading Pending', desc: '12 essays from World History require review', color: '#fef3c7' },
          ].map((alert, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: alert.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>{alert.icon}</div>
              <div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{alert.title}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{alert.desc}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>View Activity Log</button>
        </div>
      </div>

      {/* Ongoing Assessments */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600 }}>📋 Ongoing Assessments</h3>
          <Link to="/exams" style={{ fontSize: 'var(--font-sm)', color: 'var(--primary-500)', fontWeight: 500, textDecoration: 'none' }}>View All</Link>
        </div>
        <table className="table">
          <thead>
            <tr><th>Exam Name</th><th>Status</th><th>Participants</th><th>Progress</th></tr>
          </thead>
          <tbody>
            {exams.slice(0, 4).map((exam, i) => (
              <tr key={exam.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{exam.title}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{exam.course}</div>
                </td>
                <td>
                  <span className={`badge ${exam.status === 'published' ? 'badge-success' : exam.status === 'active' ? 'badge-info' : 'badge-warning'}`}>
                    ● {exam.status === 'published' ? 'Live' : exam.status}
                  </span>
                </td>
                <td>{Math.floor(Math.random() * 100 + 20)} / {Math.floor(Math.random() * 50 + 100)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                      <div style={{ width: `${60 + i * 10}%`, height: '100%', background: 'var(--primary-400)', borderRadius: 3 }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
