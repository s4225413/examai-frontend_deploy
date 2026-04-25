import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { submissionsAPI } from '../api';

export default function ResultPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (user?.id) submissionsAPI.getByStudent(user.id).then(r => setSubmissions(r.data.submissions || [])).catch(() => {});
  }, [user]);

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header"><h1>Exam Results</h1><p>View your past exam results and performance.</p></div>

      {submissions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>📊</p>
          <p style={{ color: 'var(--text-muted)' }}>No exam results yet. Complete an exam to see your results.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Exam Title</th><th>Course</th><th>Score</th><th>Percentage</th><th>Trust Score</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.exam_title || 'Exam'}</td>
                  <td>{s.exam_course || '—'}</td>
                  <td>{s.score}/{s.total_points}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                        <div style={{ width: `${s.percentage}%`, height: '100%', background: s.percentage >= 70 ? 'var(--success-400)' : s.percentage >= 50 ? 'var(--warning-400)' : 'var(--error-400)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{s.percentage}%</span>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 600, color: s.trust_score >= 8 ? 'var(--success-500)' : 'var(--warning-500)' }}>{s.trust_score}/10</span></td>
                  <td style={{ fontSize: 'var(--font-xs)' }}>{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '—'}</td>
                  <td><span className={`badge ${s.percentage >= 50 ? 'badge-success' : 'badge-error'}`}>{s.percentage >= 50 ? 'Passed' : 'Failed'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
