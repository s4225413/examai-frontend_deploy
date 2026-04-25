import { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../api';
import './Chatbot.css';

const QUICK_QUESTIONS = [
  'How do I start an exam?',
  'How does proctoring work?',
  'How to view my results?',
  'How to create an exam?',
];

const WELCOME_MSG = "Hi! 👋 I'm the ExamAI Help Assistant. I can help you navigate the platform — just ask me anything about how to use ExamAI!\n\nNote: I can only help with platform guidance, not exam answers.";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME_MSG }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotAPI.sendMessage(msg);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I couldn't process your request. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button className="chatbot-fab" onClick={() => setOpen(true)} title="Help Assistant">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-header-avatar">🤖</div>
              <div className="chatbot-header-text">
                <h4>ExamAI Help</h4>
                <p>Platform guide assistant</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chat-msg typing">Typing...</div>}
            <div ref={messagesEnd} />
          </div>

          {messages.length <= 1 && (
            <div className="chatbot-quick-btns">
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} className="chatbot-quick-btn" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask about the platform..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button className="chatbot-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
