import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examsAPI, submissionsAPI } from '../api';
import WebcamProctor from '../components/WebcamProctor';
import './ExamInterface.css';

export default function ExamInterface() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [violations, setViolations] = useState([]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    if (examId) {
      examsAPI.getById(examId).then(r => {
        const e = r.data.exam;
        setExam(e);
        setQuestions(e.question_details || []);
        setTimeLeft((e.duration_minutes || 60) * 60);
      }).catch(() => {});
    }
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0 && exam) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, exam]);

  const fmt = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const selectAnswer = (qId, val) => setAnswers(p => ({ ...p, [qId]: val }));
  const toggleFlag = (qId) => setFlagged(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });

  const handleViolation = (data) => {
    setViolations(prev => [...prev, { ...data, time: new Date().toLocaleTimeString() }]);
  };

  const handleSubmit = async () => {
    const answerList = questions.map(q => ({ question_id: q.id, answer: answers[q.id] || '' }));
    try {
      const res = await submissionsAPI.submit({ exam_id: examId, answers: answerList });
      navigate(`/exam-submission/${res.data.submission.id}`);
    } catch (e) { alert('Submission failed'); }
  };

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const totalQ = questions.length || 1;

  if (!exam) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><p style={{ color: 'var(--text-muted)' }}>Loading exam...</p></div>;

  if (showSubmitConfirm) {
    const unanswered = questions.length - answered;
    const elapsed = (exam.duration_minutes * 60) - timeLeft;
    const elapsedMin = Math.floor(elapsed / 60);
    const elapsedSec = elapsed % 60;
    const completionPct = Math.round((answered / totalQ) * 100);
    return (
      <div className="exam-layout">
        <div className="exam-topbar">
          <div className="exam-topbar-left"><span className="exam-topbar-logo">📋 ExamAI</span></div>
          <div className={`exam-timer-pill ${timeLeft < 300 ? 'danger' : ''}`}>⏱ {fmt(timeLeft)} Remaining</div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
            <div className="card" style={{ padding: 48 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, marginBottom: 8 }}>Ready to submit?</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 32px' }}>
                Please review your exam summary below. Once you click "Submit Exam", your answers will be finalized and you will no longer be able to make changes.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>📋 TOTAL QUESTIONS</div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>{questions.length}</div>
                </div>
                <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: '#16a34a', marginBottom: 4 }}>✅ ANSWERED</div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: '#16a34a' }}>{answered}</div>
                </div>
                <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: '#d97706', marginBottom: 4 }}>🚩 FLAGGED</div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: '#d97706' }}>{flagged.size}</div>
                </div>
              </div>

              <div style={{ textAlign: 'left', marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--font-sm)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>⏱ Time Elapsed</span>
                  <span style={{ fontWeight: 600 }}>{String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')} / {exam.duration_minutes}:00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: 'var(--font-sm)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>📊 Completion Rate</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 100, height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                      <div style={{ width: `${completionPct}%`, height: '100%', background: 'var(--primary-400)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{completionPct}%</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowSubmitConfirm(false)}>✏️ Review Answers</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>📤 Submit Exam</button>
              </div>

              {unanswered > 0 && (
                <div style={{ marginTop: 16, padding: '10px 16px', background: '#fef3c7', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-xs)', color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚠️ You have {unanswered} unanswered questions. If you submit now, these questions will be marked as incorrect.
                </div>
              )}
            </div>
            <div style={{ marginTop: 24, fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>© 2026 Examination Portal. All Rights Reserved. Secure Assessment Environment.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-layout">
      {/* Top bar */}
      <div className="exam-topbar">
        <div className="exam-topbar-left">
          <span className="exam-topbar-logo">📋 ExamAI</span>
          <span className="exam-topbar-title">{exam.course} · {exam.title}</span>
        </div>
        <div className="exam-topbar-center">
          <div className={`exam-timer-pill ${timeLeft < 300 ? 'danger' : ''}`}>⏱ {fmt(timeLeft)}</div>
        </div>
        <div className="exam-topbar-right">
          <div className="exam-topbar-user">
            <span>{user?.name}</span>
            <div className="exam-topbar-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowSubmitConfirm(true)}>Submit Exam</button>
        </div>
      </div>

      {/* Question progress strip */}
      <div className="question-progress-strip">
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginRight: 8, whiteSpace: 'nowrap' }}>QUESTION PROGRESS</span>
        {questions.map((qq, i) => (
          <button key={i} className={`q-progress-item ${i === current ? 'current' : ''} ${answers[qq.id] ? 'answered' : ''} ${flagged.has(qq.id) ? 'flagged' : ''}`}
            onClick={() => setCurrent(i)}>{i + 1}</button>
        ))}
      </div>

      {/* Body */}
      <div className="exam-body">
        <div className="exam-question-area">
          {q ? (
            <>
              <div className="question-header">
                <div className="question-label">QUESTION <strong>{current + 1} OF {questions.length}</strong></div>
                <button className={`flag-btn ${flagged.has(q.id) ? 'flagged' : ''}`} onClick={() => toggleFlag(q.id)}>🚩 Flag</button>
              </div>
              <div className="question-text-lg">{q.text}</div>
              {q.type === 'mcq' ? (
                <div>
                  {(q.options || []).map((opt, i) => (
                    <div key={i} className={`option-card ${answers[q.id] === opt.label ? 'selected' : ''}`} onClick={() => selectAnswer(q.id, opt.label)}>
                      <div className="option-circle">{opt.label}</div>
                      <span className="option-text">{opt.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <textarea className="exam-textarea-v2" placeholder="Type your answer here..." value={answers[q.id] || ''} onChange={e => selectAnswer(q.id, e.target.value)} />
              )}

              <div className="exam-nav">
                <button className="nav-prev" disabled={current === 0} onClick={() => setCurrent(p => p - 1)}>← Previous</button>
                {current < questions.length - 1 ? (
                  <button className="nav-next" onClick={() => setCurrent(p => p + 1)}>Save & Next →</button>
                ) : (
                  <button className="nav-next" onClick={() => setShowSubmitConfirm(true)}>Submit Exam ✓</button>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>No questions available.</div>
          )}
        </div>

        {/* Sidebar */}
        <div className="exam-sidebar-v2">
          {exam.proctoring_enabled && (
            <div className="proctor-section">
              <h4>LIVE PROCTOR <span className="proctor-rec-badge"><span className="dot" /> REC</span></h4>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 12 }}>
                <WebcamProctor examId={examId} onViolation={handleViolation} />
              </div>
              <div className="proctor-status-row">
                <span className="proctor-status-label">Integrity Status</span>
                <span className={`proctor-status-value ${violations.length < 3 ? 'secure' : 'warning'}`}>
                  {violations.length < 3 ? 'Secure' : 'Warning'}
                </span>
              </div>
            </div>
          )}

          <div className="proctor-section">
            <h4>AI ALERTS</h4>
            {violations.length === 0 ? (
              <div className="ai-alert-item">
                <div className="ai-alert-icon green">✓</div>
                <div>
                  <div className="ai-alert-text">Focus Maintained</div>
                  <div className="ai-alert-desc">Student is consistently looking at the screen.</div>
                </div>
              </div>
            ) : violations.slice(-3).reverse().map((v, i) => (
              <div key={i} className="ai-alert-item">
                <div className={`ai-alert-icon ${v.flags?.includes('no_face') ? 'red' : 'yellow'}`}>
                  {v.flags?.includes('no_face') ? '✕' : '⚠'}
                </div>
                <div>
                  <div className="ai-alert-text">{v.flags?.[0]?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'Alert'}</div>
                  <div className="ai-alert-desc">{v.details || 'Suspicious activity detected'}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="contact-proctor-btn">📞 Contact Proctor</button>
        </div>
      </div>

      {/* Legend bar */}
      <div className="exam-legend">
        <span><div className="legend-dot answered" /> Answered</span>
        <span><div className="legend-dot current" /> Current Question</span>
        <span><div className="legend-dot flagged" /> Flagged for Review</span>
      </div>

      {/* Bottom progress */}
      <div className="exam-bottom-bar">
        <div className="overall-bar">
          <span>Overall Progress</span>
          <div className="overall-bar-track"><div className="overall-bar-fill" style={{ width: `${(answered / totalQ) * 100}%` }} /></div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span>{answered} / {questions.length} Completed</span>
          <span>|</span>
          <span>Last saved: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
