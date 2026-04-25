import { useState } from 'react';
import WebcamProctor from '../components/WebcamProctor';

export default function AIProctorScreen() {
  const [violations, setViolations] = useState([]);

  const handleViolation = (data) => {
    setViolations(prev => [...prev, { ...data, time: new Date().toLocaleTimeString() }]);
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1>AI Proctor Monitor</h1>
        <p>Real-time webcam monitoring with face detection</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <WebcamProctor examId="test" onViolation={handleViolation} />
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 12 }}>Detection Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Total Violations</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: violations.length > 5 ? 'var(--error-500)' : 'var(--primary-500)' }}>{violations.length}</div>
              </div>
              <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Trust Score</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--success-500)' }}>{Math.max(0, (10 - violations.length * 0.5)).toFixed(1)}/10</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 16 }}>Violation Log</h3>
            {violations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)', textAlign: 'center', padding: 24 }}>✅ No violations detected</p>
            ) : (
              <div style={{ maxHeight: 400, overflow: 'auto' }}>
                {violations.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span className={`badge ${v.flags?.includes('no_face') ? 'badge-error' : 'badge-warning'}`}>
                      {v.flags?.[0] || 'alert'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--font-sm)' }}>{v.details || 'Violation detected'}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{v.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
