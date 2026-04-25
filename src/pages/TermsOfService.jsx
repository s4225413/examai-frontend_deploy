import React from 'react';

export default function TermsOfService() {
  return (
    <div className="page-content animate-fade-in" style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'var(--gray-100)', color: 'var(--gray-600)', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '20px' }}>LEGAL INFORMATION</div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.02em' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Last updated: May 2026</p>
      </div>
      
      <div className="card" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginTop: '0', marginBottom: '16px' }}>1. Acceptance of Terms</h3>
          <p style={{ marginBottom: '32px' }}>By accessing and utilising the ExamAI platform, you agree to be bound unconditionally by these Terms of Service, all applicable UK laws, and relevant academic regulations. If you disagree with any part of these terms, you may not access the service.</p>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>2. Academic Integrity & Conduct</h3>
          <p style={{ marginBottom: '32px' }}>You agree to adhere strictly to the academic integrity policies established by your affiliated institution. You must not engage in any form of cheating, plagiarism, screen-sharing, or unauthorised assistance during examinations.</p>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>3. System Monitoring</h3>
          <p style={{ marginBottom: '32px' }}>You acknowledge that the ExamAI platform actively monitors browser activity, window focus, and webcam telemetry during active assessments to detect anomalies. Attempting to circumvent, bypass, or deceive these AI proctoring systems is a direct violation of these terms.</p>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>4. Disclaimer of Warranties</h3>
          <p>ExamAI is provided on an "as is" and "as available" basis without any warranties, expressed or implied. We do not warrant that the platform will be entirely uninterrupted, although we guarantee 99.9% uptime as per our institutional Service Level Agreements (SLAs).</p>
        </div>
      </div>
    </div>
  );
}
