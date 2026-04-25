import React from 'react';

export default function About() {
  return (
    <div className="page-content animate-fade-in" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          About <span className="gradient-text">ExamAI</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
          Based in the heart of London's Tech City, we are revolutionising the way academic institutions across the UK and the globe conduct secure, AI-driven online assessments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
        <div className="card card-elevated" style={{ padding: '32px', borderTop: '4px solid var(--primary-500)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🎯
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            We aim to uphold uncompromising academic integrity by providing state-of-the-art AI-proctored examination tools that are accessible, reliable, and rigorously compliant with UK GDPR regulations.
          </p>
        </div>

        <div className="card card-elevated" style={{ padding: '32px', borderTop: '4px solid var(--accent-500)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: 'var(--accent-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            ⚡
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Innovative Tech</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            Developed in collaboration with leading UK universities, our platform utilises cutting-edge OpenCV facial recognition and OpenAI’s advanced models to offer dynamic question generation and real-time proctoring.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '40px', background: 'linear-gradient(135deg, var(--gray-900), var(--primary-900))', color: 'white', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '16px' }}>Join the Future of Education</h2>
        <p style={{ color: 'var(--gray-300)', fontSize: '1.1rem', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Experience a secure, seamless, and intelligent examination platform designed for the modern academic landscape.
        </p>
        <button className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--primary-700)', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>Partner With Us</button>
      </div>
    </div>
  );
}
