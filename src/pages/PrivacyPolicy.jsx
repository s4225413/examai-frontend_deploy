import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="page-content animate-fade-in" style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'var(--gray-100)', color: 'var(--gray-600)', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '20px' }}>LEGAL INFORMATION</div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Last updated: May 2026 • Valid for UK & EU regions</p>
      </div>
      
      <div className="card" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginTop: '0', marginBottom: '16px' }}>1. Data Collection & GDPR Compliance</h3>
          <p style={{ marginBottom: '32px' }}>We collect information necessary to facilitate a secure examination environment. This includes basic profile data, exam submissions, and automated webcam analysis data for proctoring purposes. All data is processed in strict compliance with the UK General Data Protection Regulation (UK GDPR).</p>
          
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>2. Use of Webcam and Biometrics</h3>
          <p style={{ marginBottom: '32px' }}>During an exam, our proctoring system uses OpenCV to analyse your webcam feed in real-time. <strong>We do NOT store or transmit live video feeds.</strong> The system exclusively retains anonymous metadata logs (e.g., "Multiple faces detected") to assure academic integrity without compromising privacy.</p>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>3. Data Sharing & Third Parties</h3>
          <p style={{ marginBottom: '32px' }}>Your data is solely accessible to authorised instructors and platform administrators. We do not sell your personal data. Exam content is securely transmitted to our AI service partners (OpenAI) strictly for generating dynamic questions and providing grading feedback over encrypted channels.</p>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>4. Enterprise Security Standards</h3>
          <p>We implement industry-standard AES-256 encryption and robust security measures to protect your data at rest and in transit. All API communications are secured with stateless JWT tokens and processed via forced HTTPS TLS 1.3 connections.</p>
        </div>
      </div>
    </div>
  );
}
