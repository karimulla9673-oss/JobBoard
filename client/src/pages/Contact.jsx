import React, { useState } from 'react';
import SEO from '../components/SEO';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/contact/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✓ Thanks — your message was received. We will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setMessage(`✗ Error: ${data.message || 'Failed to send message'}`);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage('✗ Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page container">
      <SEO title="Contact - Offcampus Jobs" description="Contact Offcampus Jobs" />

      <h1>Contact Us</h1>
      <p>If you have questions, reach us at <a href="mailto:offcampusjobs786@gmail.com">offcampusjobs786@gmail.com</a></p>

      <form className="contact-form" onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email Address</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Message</label>
        <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />

        {message && (
          <div className={`contact-message ${message.startsWith('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
