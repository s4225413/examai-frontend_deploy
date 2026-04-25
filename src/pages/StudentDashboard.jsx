import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examsAPI, submissionsAPI } from '../api';
import StatsCard from '../components/StatsCard';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    examsAPI.getAll().then(r => setExams(r.data.exams || [])).catch(() => {});
    if (user?.id) submissionsAPI.getByStudent(user.id).then(r => setSubmissions(r.data.submissions || [])).catch(() => {});
  }, [user]);

  const avgScore = submissions.length ? Math.round(submissions.reduce((a, s) => a + (s.percentage || 0), 0) / submissions.length) : 0;

  return (
    <div className="page-content animate-fade-in">
      <div className="dashboard-welcome">
        <h2>Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h2>
        <p>You have {exams.length} exams scheduled. Good luck!</p>
      </div>

      <div className="dashboard-grid">
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>} value={exams.length} label="Upcoming Exams" trend="+1 new" color="purple" />
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} value={submissions.length} label="Completed Exams" trend="+2 this week" color="blue" />
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>} value={`${avgScore}%`} label="Average Score" trend="+3%" color="green" />
        <StatsCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} value="0" label="AI Alerts" color="orange" trendDir="down" trend="Safe" />
      </div>

      <div className="dashboard-two-col">
        <div>
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h3>Upcoming Exams</h3>
              <Link to="/exams">View All</Link>
            </div>
            {exams.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                <p style={{ color: 'var(--text-muted)' }}>No exams scheduled yet</p>
                <Link to="/exams" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Browse Exams</Link>
              </div>
            ) : exams.slice(0, 3).map(exam => (
              <div key={exam.id} className="exam-list-item">
                <div className="exam-list-icon">📝</div>
                <div className="exam-list-info">
                  <h4>{exam.title}</h4>
                  <p>{exam.course} · {exam.duration_minutes} mins · {exam.questions?.length || 0} Questions</p>
                </div>
                <Link to={`/exam-instructions/${exam.id}`} className="btn btn-primary btn-sm">Start</Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="dashboard-section">
            <div className="dashboard-section-header"><h3>Recent Activity</h3></div>
            <div className="card">
              {submissions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)', padding: 16 }}>No activity yet</p>
              ) : submissions.slice(0, 5).map((s, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" />
                  <div>
                    <div className="activity-text">Completed: {s.exam_title || 'Exam'}</div>
                    <div className="activity-time">Score: {s.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="proctor-status-card">
            <h4>🛡️ AI Proctored Status</h4>
            <p>Your proctoring profile is currently verified and healthy. No violations detected in previous sessions.</p>
            <div className="trust-score">
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>TRUST SCORE</span>
              <span className="trust-score-value">9.8/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
