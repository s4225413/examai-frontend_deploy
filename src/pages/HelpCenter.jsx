import React from 'react';

export default function HelpCenter() {
  const faqs = [
    { q: "How do I start an exam?", a: "Navigate to the 'Exams' page from your dashboard. Select an available exam and click 'Start'. Make sure your webcam is enabled before proceeding.", icon: "🚀" },
    { q: "Why is my webcam not working?", a: "Ensure that your browser has permission to access your camera. Check the camera icon in your URL bar and click 'Allow'. Also, verify that no other applications are using the camera.", icon: "📷" },
    { q: "What happens if I lose my internet connection?", a: "ExamAI automatically saves your progress locally. Once your connection is restored, you can resume the exam seamlessly without losing data.", icon: "🌐" },
    { q: "How do I report a technical issue?", a: "Please use the floating AI Help Assistant at the bottom right of your screen to log any issues or contact your institution's support desk.", icon: "🔧" }
  ];

  return (
    <div className="page-content animate-fade-in" style={{ padding: '60px 24px', maxWidth: '900px', margin: '0 auto', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '20px' }}>SUPPORT CENTER</div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          How can we <span className="gradient-text">help you?</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Browse our FAQs below or ask our AI Help Assistant in the bottom right corner.</p>
      </div>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {faqs.map((faq, i) => (
          <div key={i} className="card card-elevated" style={{ padding: '30px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '12px', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {faq.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>{faq.q}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
