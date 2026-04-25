import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examsAPI } from '../api';
import './ExamInstructions.css';

export default function ExamInstructions() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);

  useEffect(() => { if (examId) examsAPI.getById(examId).then(r => setExam(r.data.exam)).catch(() => {}); }, [examId]);

  if (!exam) return <div className="page-content" style={{ textAlign: 'center', paddingTop: 80 }}><p>Loading exam details...</p></div>;

  return (
    <div className="page-content animate-fade-in">
      <div className="instructions-page">
        <div className="instructions-card">
          <h1>{exam.title}</h1>
          <p className="subtitle">{exam.course} · {exam.duration_minutes} minutes · {exam.questions?.length || 0} questions</p>

          <div className="instructions-section">
            <h3>📋 Exam Rules</h3>
            <ul className="instructions-list">
              <li>Do not navigate away from the exam window during the test.</li>
              <li>Ensure your webcam is enabled and your face is visible at all times.</li>
              <li>No external resources, notes, or assistance are allowed.</li>
              <li>You must complete the exam within the allotted time.</li>
              <li>Any suspicious activity will be flagged and reviewed.</li>
            </ul>
          </div>

          <div className="instructions-section">
            <h3>🖥️ System Requirements</h3>
            <div className="instructions-requirements">
              <div className="requirement-item met">✅ Webcam Access</div>
              <div className="requirement-item met">✅ Stable Internet</div>
              <div className="requirement-item met">✅ Modern Browser</div>
              <div className="requirement-item met">✅ Fullscreen Mode</div>
            </div>
          </div>

          {exam.proctoring_enabled && (
            <div className="instructions-section">
              <h3>🛡️ AI Proctoring</h3>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                This exam uses AI-powered proctoring. Your webcam will be monitored for face detection, gaze tracking, and suspicious activity. A trust score will be calculated based on your behaviour during the exam.
              </p>
            </div>
          )}

          <div className="instructions-actions">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
            <button className="btn btn-primary" onClick={() => navigate(`/exam/${examId}`)}>🚀 Start Exam</button>
          </div>
        </div>
      </div>
    </div>
  );
}
