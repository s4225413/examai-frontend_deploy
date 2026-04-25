import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionsAPI } from '../api';

export default function ExamSubmission() {
  const { submissionId } = useParams();
  const [sub, setSub] = useState(null);

  useEffect(() => { if (submissionId) submissionsAPI.getById(submissionId).then(r => setSub(r.data.submission)).catch(() => {}); }, [submissionId]);

  if (!sub) return <div className="page-content" style={{ textAlign: 'center', paddingTop: 80 }}><p>Loading results...</p></div>;

  return (
    <div className="page-content animate-fade-in">
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: 48 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>{sub.percentage >= 70 ? '🎉' : sub.percentage >= 50 ? '👍' : '📚'}</div>
          <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 700, marginBottom: 8 }}>Exam Submitted!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Your exam has been submitted and graded successfully.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--primary-500)' }}>{sub.percentage}%</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Score</div>
            </div>
            <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>{sub.score}/{sub.total_points}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Points</div>
            </div>
            <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: sub.trust_score >= 8 ? 'var(--success-500)' : 'var(--warning-500)' }}>{sub.trust_score}/10</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Trust Score</div>
            </div>
          </div>

          {sub.proctor_flags?.length > 0 && (
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 8 }}>Proctor Flags</h3>
              {sub.proctor_flags.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 'var(--font-sm)' }}>
                  <span className="badge badge-warning">{f.type}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{f.details}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/results" className="btn btn-primary">View All Results</Link>
            <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
