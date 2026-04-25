import { useState, useEffect } from 'react';
import { questionsAPI } from '../api';

const typeBadges = {
  mcq: { label: 'Multiple Choice', cls: 'badge-primary' },
  short_answer: { label: 'Short Answer', cls: 'badge-success' },
  essay: { label: 'Essay', cls: 'badge-info' },
  coding: { label: 'Coding', cls: 'badge-warning' },
};
const diffBadges = { easy: 'badge-success', medium: 'badge-warning', hard: 'badge-error' };
const topicMap = {
  'algorithms': 'Algorithms', 'data-structures': 'Data Structures', 'complexity': 'Algorithms',
  'hashing': 'Data Structures', 'sorting': 'Algorithms', 'calculus': 'Mathematics',
  'derivatives': 'Mathematics', 'integrals': 'Mathematics', 'limits': 'Mathematics',
  'algebra': 'Mathematics', 'marketing-basics': 'Marketing', 'branding': 'Marketing',
  'chemistry-basics': 'Chemistry', 'reactions': 'Chemistry', 'acids-bases': 'Chemistry',
  'linguistics': 'Linguistics',
};

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ text: '', type: 'mcq', options: [{ label: 'A', text: '' }, { label: 'B', text: '' }, { label: 'C', text: '' }, { label: 'D', text: '' }], correct_answer: '', difficulty: 'medium', tags: '', points: 1 });
  const [filter, setFilter] = useState({ type: '', difficulty: '', topic: '' });
  const [genTopic, setGenTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadQuestions(); }, [filter]);
  const loadQuestions = () => { questionsAPI.getAll(filter).then(r => setQuestions(r.data.questions || [])).catch(() => {}); };

  const handleCreate = async () => {
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try { await questionsAPI.create(data); setShowForm(false); loadQuestions(); } catch { alert('Failed'); }
  };

  const handleGenerate = async () => {
    if (!genTopic) return;
    setGenerating(true);
    try {
      const r = await questionsAPI.generate({ topic: genTopic, num_questions: 5 });
      const generated = r.data.questions || [];
      for (const q of generated) { await questionsAPI.create({ ...q, tags: [genTopic] }); }
      loadQuestions(); setGenTopic('');
    } catch { alert('Generation failed'); }
    finally { setGenerating(false); }
  };

  const handleDelete = async (id) => { await questionsAPI.delete(id); loadQuestions(); };

  const getTopic = (tags) => {
    for (const t of (tags || [])) { if (topicMap[t]) return topicMap[t]; }
    return tags?.[0] || '—';
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>Question Bank</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginTop: 4 }}>Manage and organize {questions.length} academic questions</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm">📥 Import</button>
          <button className="btn btn-ghost btn-sm">📤 Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>+ New Question</button>
        </div>
      </div>

      {/* AI Generator */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--primary-50), #e0f2fe)', border: 'none' }}>
        <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 12 }}>✨ AI Question Generator</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="form-input" placeholder="Enter topic (e.g. Machine Learning, Data Structures)" value={genTopic} onChange={e => setGenTopic(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>{generating ? 'Generating...' : '🤖 Generate 5 Questions'}</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 16 }}>New Question</h3>
          <div className="form-group"><label className="form-label">Question Text</label><textarea className="form-input" style={{ minHeight: 80 }} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="mcq">MCQ</option><option value="short_answer">Short Answer</option><option value="essay">Essay</option></select></div>
            <div className="form-group"><label className="form-label">Difficulty</label><select className="form-select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}><option>easy</option><option>medium</option><option>hard</option></select></div>
            <div className="form-group"><label className="form-label">Points</label><input type="number" className="form-input" value={form.points} onChange={e => setForm({ ...form, points: parseInt(e.target.value) || 1 })} /></div>
          </div>
          {form.type === 'mcq' && (
            <div className="form-group"><label className="form-label">Options</label>
              {form.options.map((o, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{o.label}</span>
                  <input className="form-input" value={o.text} onChange={e => { const opts = [...form.options]; opts[i].text = e.target.value; setForm({ ...form, options: opts }); }} />
                </div>
              ))}
            </div>
          )}
          <div className="form-group"><label className="form-label">Correct Answer</label><input className="form-input" value={form.correct_answer} onChange={e => setForm({ ...form, correct_answer: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-primary" onClick={handleCreate}>Save Question</button><button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button></div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        <select className="form-select" style={{ width: 150 }} value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All Types</option><option value="mcq">MCQ</option><option value="short_answer">Short Answer</option><option value="essay">Essay</option>
        </select>
        <select className="form-select" style={{ width: 150 }} value={filter.difficulty} onChange={e => setFilter({ ...filter, difficulty: e.target.value })}>
          <option value="">All Levels</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
        </select>
        <select className="form-select" style={{ width: 150 }} value={filter.topic} onChange={e => setFilter({ ...filter, topic: e.target.value })}>
          <option value="">All Topics</option>
        </select>
        <button className="btn btn-ghost btn-sm" onClick={() => setFilter({ type: '', difficulty: '', topic: '' })} style={{ marginLeft: 'auto' }}>Clear Filters</button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>QUESTION CONTENT</th>
              <th>TYPE</th>
              <th>DIFFICULTY</th>
              <th>TOPIC</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No questions yet. Add one or use AI to generate!</td></tr>
            ) : questions.map((q, i) => {
              const tb = typeBadges[q.type] || { label: q.type, cls: 'badge-info' };
              return (
                <tr key={q.id} style={{ animationDelay: `${i * 0.03}s` }}>
                  <td style={{ paddingLeft: 20, maxWidth: 320 }}>
                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.text}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 2 }}>ID: {q.id?.slice(-6)} • Last updated 2 days ago</div>
                  </td>
                  <td><span className={`badge ${tb.cls}`}>{tb.label}</span></td>
                  <td><span className={`badge ${diffBadges[q.difficulty] || 'badge-info'}`}>{q.difficulty}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>{getTopic(q.tags)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" title="Edit" style={{ padding: '4px 8px' }}>✏️</button>
                      <button className="btn btn-ghost btn-sm" title="Delete" style={{ padding: '4px 8px' }} onClick={() => handleDelete(q.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {questions.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-color)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            <span>Showing 1 - {questions.length} of {questions.length} questions</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>‹</button>
              <button className="btn btn-primary btn-sm" style={{ padding: '4px 10px', minWidth: 32 }}>1</button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
