import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-inner">
          <div>
            <div className="home-hero-badge">🛡️ NEXT-GEN PROCTORING</div>
            <h1>Secure <span>AI-Powered</span> Online Examination Platform</h1>
            <p>Experience the future of digital assessments with advanced proctoring and integrity monitoring. Ensure fairness for every candidate, anywhere in the world.</p>
            <div className="home-hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Start Exam</Link>
              <a href="#features" className="btn btn-secondary btn-lg">Learn More</a>
            </div>
          </div>
          <div className="home-hero-visual">
            <div className="home-hero-card">
              <div className="home-hero-card-header">
                <div className="home-hero-card-avatar" />
                <div className="home-hero-card-info">
                  <h4>Live Exam Session</h4>
                  <p>Advanced Quantum Mechanics</p>
                </div>
              </div>
              <div className="home-hero-card-status">
                <span className="dot" />
                AI Monitoring Active. 100% Integrity.
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--primary-400)' }} />
                <div style={{ flex: 0.3, height: 8, borderRadius: 4, background: 'var(--gray-200)' }} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Progress: 76%</span><span>Time: 23:45</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="home-stats-inner">
          <div className="home-stat-item"><h3>2M+</h3><p>Students Monitored</p></div>
          <div className="home-stat-item"><h3>500k</h3><p>Exams Conducted</p></div>
          <div className="home-stat-item"><h3>99.9%</h3><p>Integrity Score</p></div>
          <div className="home-stat-item"><h3>0</h3><p>Security Incidents</p></div>
        </div>
      </section>

      <section className="home-features" id="features">
        <div className="home-features-inner">
          <div className="home-features-header">
            <h2>Advanced Features</h2>
            <p>Our platform leverages cutting-edge AI to ensure fair and secure examinations through a multi-layered security approach.</p>
          </div>
          <div className="home-features-grid">
            {[
              { icon: '🎯', title: 'AI Proctoring', desc: 'Automated oversight using computer vision to track gaze, posture, and presence.' },
              { icon: '📊', title: 'Adaptive Testing', desc: 'Dynamic difficulty adjustment based on student performance in real-time.' },
              { icon: '🔍', title: 'Behaviour Monitoring', desc: 'Real-time analysis of candidate focus and unusual browser activities.' },
              { icon: '🔐', title: 'Secure Authentication', desc: 'Multi-factor biometric verification ensuring the right person is taking the test.' }
            ].map((f, i) => (
              <div key={i} className="home-feature-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="home-feature-icon"><span style={{ fontSize: '1.5rem' }}>{f.icon}</span></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-how" id="about">
        <h2>How It Works</h2>
        <p>Three simple steps to a secure assessment</p>
        <div className="home-how-steps">
          <div><div className="home-step-num">1</div><h3>Create Your Exam</h3><p>Set up questions, configure proctoring rules, and publish your exam in minutes.</p></div>
          <div><div className="home-step-num">2</div><h3>Students Take Exam</h3><p>AI monitors students in real-time through webcam and browser activity tracking.</p></div>
          <div><div className="home-step-num">3</div><h3>Get Results</h3><p>Auto-graded results with detailed proctoring reports and integrity scores.</p></div>
        </div>
      </section>

      <section className="home-cta" id="contact">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of institutions using ExamAI for secure, fair, and efficient online examinations.</p>
        <Link to="/register" className="btn btn-lg">Create Free Account</Link>
      </section>
    </>
  );
}
