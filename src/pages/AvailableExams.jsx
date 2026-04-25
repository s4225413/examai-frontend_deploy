import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examsAPI, submissionsAPI } from '../api';
import './AvailableExams.css';

const cardStyles = [
  { icon: '📐', iconColor: 'purple', btnClass: 'purple-bg', accent: 'var(--primary-400)' },
  { icon: '📊', iconColor: 'green', btnClass: 'green-bg', accent: '#22c55e' },
  { icon: '🧪', iconColor: 'orange', btnClass: 'red-bg', accent: '#ef4444' },
  { icon: '📚', iconColor: 'blue', btnClass: 'blue-bg', accent: '#0ea5e9' },
  { icon: '🎯', iconColor: 'purple', btnClass: 'purple-bg', accent: 'var(--primary-400)' },
  { icon: '💻', iconColor: 'green', btnClass: 'green-bg', accent: '#22c55e' },
];
const diffColors = { beginner: 'badge-success', easy: 'badge-success', intermediate: 'badge-warning', hard: 'badge-error', expert: 'badge-error' };

export default function AvailableExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tab, setTab] = useState('all');
  const [view, setView] = useState('card');

  useEffect(() => {
    examsAPI.getAll().then(r => setExams(r.data.exams || [])).catch(() => {});
    if (user?.id) submissionsAPI.getByStudent(user.id).then(r => setSubmissions(r.data.submissions || [])).catch(() => {});
  }, [user]);

  const filtered = tab === 'all' ? exams : exams.filter(e =>
    tab === 'upcoming' ? e.status === 'published' :
    tab === 'active' ? e.status === 'active' :
    tab === 'completed' ? e.status === 'completed' : true
  );

  return (
    <div className="page-content animate-fade-in">
      <div className="avail-header">
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>Available Exams</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginTop: 4 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}. You have {exams.length} exams scheduled for this week.
          </p>
        </div>
        <div className="view-toggle">
          <button className={view === 'card' ? 'active' : ''} onClick={() => setView('card')}>📋 Card View</button>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>📊 Table View</button>
        </div>
      </div>

      <div className="avail-tabs">
        {['all', 'upcoming', 'active', 'completed'].map(t => (
          <button key={t} className={`avail-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'all' ? 'All Exams' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {view === 'card' ? (
        <>
          <div className="avail-grid">
            {filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 48, gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '2rem', marginBottom: 8 }}>📚</p>
                <p style={{ color: 'var(--text-muted)' }}>No exams found</p>
              </div>
            ) : filtered.map((exam, i) => {
              const style = cardStyles[i % cardStyles.length];
              return (
                <div key={exam.id} className="exam-card-v2 animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="card-accent" style={{ background: style.accent }} />
                  <div className="card-badge">
                    <span className={`badge ${diffColors[exam.difficulty] || 'badge-info'}`}>{exam.difficulty}</span>
                  </div>
                  <div className={`card-icon ${style.iconColor}`}>{style.icon}</div>
                  <div className="card-course">{exam.course || 'General'}</div>
                  <h3>{exam.title}</h3>
                  <div className="card-meta">
                    <span>⏱ {exam.duration_minutes} mins</span>
                    <span>❓ {exam.questions?.length || 0} Questions</span>
                  </div>
                  <div className="card-actions">
                    {exam.status === 'draft' ? (
                      <span className="starts-badge">📅 Starts in 3 Days</span>
                    ) : (
                      <Link to={`/exam-instructions/${exam.id}`} className={`start-btn ${style.btnClass}`}>
                        Start Exam →
                      </Link>
                    )}
                    <Link to={`/exam-instructions/${exam.id}`} className="view-btn">View Instructions</Link>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="load-more-btn">Load More Exams →</button>

          {/* Recent Results Summary */}
          {submissions.length > 0 && (
            <div className="results-summary">
              <div className="results-summary-header">
                <h2>Recent Results Summary</h2>
                <Link to="/results">View All Results</Link>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr><th>Exam Title</th><th>Date</th><th>Score</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 5).map((s, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{s.exam_title || 'Exam'}</div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{s.exam_course || ''}</div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                        <td style={{ fontWeight: 600 }}>{s.percentage}%</td>
                        <td>
                          <span className={`badge ${s.percentage >= 50 ? 'badge-success' : 'badge-error'}`}>
                            ● {s.percentage >= 50 ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="page-footer-bar">
            <span>© 2026 ExamAI Student Management System</span>
            <div className="page-footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Help Center</a>
            </div>
          </div>
        </>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Exam Title</th><th>Course</th><th>Duration</th><th>Questions</th><th>Difficulty</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(exam => (
                <tr key={exam.id}>
                  <td style={{ fontWeight: 600 }}>{exam.title}</td>
                  <td>{exam.course || '—'}</td>
                  <td>{exam.duration_minutes} min</td>
                  <td>{exam.questions?.length || 0}</td>
                  <td><span className={`badge ${diffColors[exam.difficulty] || 'badge-info'}`}>{exam.difficulty}</span></td>
                  <td><Link to={`/exam-instructions/${exam.id}`} className="btn btn-primary btn-sm">Start</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
