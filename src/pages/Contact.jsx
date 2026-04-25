import React from 'react';

export default function Contact() {
  return (
    <div className="page-content animate-fade-in" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          Whether you're looking to partner with us or need technical assistance, our UK-based team is here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
        
        {/* Contact Form side */}
        <div className="card card-elevated" style={{ padding: '40px', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>Send us a Message</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--gray-500)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
              <input type="text" className="form-input" placeholder="e.g. Dr. Sarah Jenkins" required style={{ padding: '12px 16px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--gray-500)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Email</label>
              <input type="email" className="form-input" placeholder="name@university.ac.uk" required style={{ padding: '12px 16px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--gray-500)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
              <textarea className="form-input" rows="5" placeholder="How can we assist your institution?" required style={{ resize: 'vertical', padding: '12px 16px' }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '10px', width: '100%' }}>Send Message</button>
          </form>
        </div>

        {/* Info side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="card" style={{ padding: '32px', background: 'var(--gray-50)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', fontSize: '1.2rem' }}>📍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>London Headquarters</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginLeft: '56px' }}>
              <strong>ExamAI Technologies Ltd</strong><br />
              Level 3, Innovation House<br />
              Old Street, Tech City<br />
              London, EC1V 9HL<br />
              United Kingdom
            </p>
          </div>

          <div className="card" style={{ padding: '32px', background: 'var(--gray-50)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', fontSize: '1.2rem' }}>✉️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Direct Contact</h3>
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '56px' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>Support:</strong> support@examai.co.uk</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Partners:</strong> partners@examai.co.uk</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Phone:</strong> +44 (0) 20 7946 0123</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
