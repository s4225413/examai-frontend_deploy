import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examsAPI } from '../api';
import './CreateExam.css';

const DIFF_CONFIG = {
  easy:         { duration: 10, questions: 4,  effort: 'Low' },
  beginner:     { duration: 10, questions: 4,  effort: 'Low' },
  intermediate: { duration: 20, questions: 15, effort: 'Medium' },
  hard:         { duration: 40, questions: 25, effort: 'High' },
  expert:       { duration: 40, questions: 25, effort: 'High' },
};

export default function CreateExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', course: '', description: '', difficulty: 'intermediate', proctoring_enabled: true, adaptive_difficulty: false });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const config = DIFF_CONFIG[form.difficulty] || DIFF_CONFIG.intermediate;

  const handleSave = async (status = 'draft') => {
    if (!form.title) return alert('Please enter an exam title');
    if (!form.course) return alert('Please select a course');
    setSaving(true);
    setGenerating(true);
    try {
      const res = await examsAPI.create({ ...form, status });
      alert(res.data.message || 'Exam created!');
      navigate('/instructor');
    } catch (e) { alert(e.response?.data?.error || 'Failed to create exam'); }
    finally { setSaving(false); setGenerating(false); }
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back to Exams</button>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, marginTop: 8 }}>Create New Assessment</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Configure your exam settings. AI will auto-generate questions based on the topic and difficulty.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => handleSave('draft')} disabled={saving}>Save as Draft</button>
          <button className="btn btn-primary" onClick={() => handleSave('published')} disabled={saving}>
            {generating && saving ? '🤖 Generating...' : '🚀 Publish Exam'}
          </button>
        </div>
      </div>

      <div className="create-exam-layout">
        <div className="create-exam-form">
          <div className="card">
            <h3>📋 General Information</h3>
            <div className="form-group">
              <label className="form-label">Exam Title</label>
              <input className="form-input" placeholder="e.g. Advanced Quantum Mechanics - Final Term" value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Course / Topic <span style={{ fontSize: 'var(--font-xs)', color: 'var(--primary-500)', fontWeight: 400 }}>— AI generates questions from this</span></label>
              <select className="form-select" value={form.course} onChange={e => update('course', e.target.value)}>
                <option value="">Select a course</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Business Admin</option>
                <option>Humanities</option>
                <option>Biology</option>
                <option>Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea className="form-input" rows="3" placeholder="Brief description of the exam..." value={form.description} onChange={e => update('description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <div className="difficulty-btns">
                {['easy', 'intermediate', 'hard'].map(d => (
                  <button key={d} className={form.difficulty === d ? 'active' : ''} onClick={() => update('difficulty', d)}>
                    {d === 'easy' ? '🟢' : d === 'intermediate' ? '🟡' : '🔴'} {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-calculated info banner */}
            <div style={{ padding: 16, background: 'linear-gradient(135deg, var(--primary-50), #e0f2fe)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', marginTop: 12 }}>
              <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 8, color: 'var(--primary-600)' }}>🤖 AI Auto-Configuration</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--primary-500)' }}>{config.questions}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Questions (AI Generated)</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--primary-500)' }}>{config.duration}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Minutes Duration</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--primary-500)' }}>{config.effort}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Effort Level</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>✨ Smart Features</h3>
            <div className="feature-toggle">
              <div className="feature-toggle-info">
                <h4>🎯 AI Proctoring</h4>
                <p>Enable gaze tracking, object detection, and tab-switch monitoring.</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.proctoring_enabled} onChange={e => update('proctoring_enabled', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="feature-toggle">
              <div className="feature-toggle-info">
                <h4>📊 Adaptive Difficulty</h4>
                <p>Automatically adjust question complexity based on real-time performance.</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.adaptive_difficulty} onChange={e => update('adaptive_difficulty', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        <div className="create-sidebar">
          <div className="card" style={{ background: 'var(--primary-50)', border: 'none' }}>
            <h4>Exam Summary</h4>
            <div className="summary-item"><span>Difficulty</span><span className={`badge ${form.difficulty === 'easy' ? 'badge-success' : form.difficulty === 'hard' ? 'badge-error' : 'badge-warning'}`}>{form.difficulty}</span></div>
            <div className="summary-item"><span>Duration</span><span>{config.duration} min</span></div>
            <div className="summary-item"><span>Total Questions</span><span>{config.questions}</span></div>
            <div className="summary-item"><span>Generated By</span><span>🤖 OpenAI</span></div>
          </div>
          <div className="card">
            <h4>Security Rules</h4>
            <div className="security-rule"><span className="check">✓</span> Fullscreen Mode Required</div>
            <div className="security-rule"><span className="check">✓</span> Shuffle Question Order</div>
            <div className="security-rule"><span className="check">✓</span> Disable Copy-Paste</div>
          </div>
          <div className="card">
            <h4>How it works</h4>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              1. Select a <strong>course/topic</strong><br />
              2. Choose a <strong>difficulty level</strong><br />
              3. Click <strong>Publish</strong> — AI generates the questions automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
