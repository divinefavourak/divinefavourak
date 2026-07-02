import React, { useState } from "react";
import NBWindow from "../components/NBWindow.jsx";
import FadeIn from "../components/FadeIn.jsx";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus((p) => ({ ...p, success: false })), 5000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setStatus({ submitting: false, success: false, error: error.message || "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="nb-section-wrap">
      <NBWindow title="CONTACT.TXT" accent="--lime">
        <p className="nb-dir-header">
          {">"} initiate_connection &nbsp;— Let's talk
        </p>

        <div className="nb-contact-grid">
          {/* Form */}
          <FadeIn delay={100}>
            <form onSubmit={handleSubmit} noValidate>
              <div className="nb-form-group">
                <label htmlFor="contact-name" className="nb-label">// Enter ID (Name)</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="nb-input"
                  placeholder="Guest_User"
                  required
                  disabled={status.submitting}
                  autoComplete="name"
                />
              </div>

              <div className="nb-form-group">
                <label htmlFor="contact-email" className="nb-label">// Enter Frequency (Email)</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="nb-input"
                  placeholder="user@domain.com"
                  required
                  disabled={status.submitting}
                  autoComplete="email"
                  itemProp="email"
                />
              </div>

              <div className="nb-form-group">
                <label htmlFor="contact-message" className="nb-label">// Data Packet (Message)</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="nb-textarea"
                  placeholder="Type your message here..."
                  required
                  disabled={status.submitting}
                />
              </div>

              {status.success && (
                <div className="nb-form-success" role="alert">
                  ✓ Message sent! I'll get back to you soon.
                </div>
              )}

              {status.error && (
                <div className="nb-form-error" role="alert">
                  ✗ {status.error}
                </div>
              )}

              <button
                type="submit"
                className="nb-btn nb-btn-inv nb-btn-full"
                disabled={status.submitting}
                style={{ marginTop: '0.25rem' }}
              >
                {status.submitting ? "> SENDING..." : "> SEND_TRANSMISSION"}
              </button>
            </form>
          </FadeIn>

          {/* Contact info */}
          <FadeIn delay={200}>
            <div className="nb-contact-info">
              <div className="nb-contact-info-header">
                <span>📄 CONTACT_INFO.DAT</span>
              </div>
              <div className="nb-contact-info-body">
                <div className="nb-contact-row">
                  <span className="nb-contact-key">Loc</span>
                  <span itemProp="addressLocality">Lagos</span>,&nbsp;
                  <span itemProp="addressCountry">Nigeria</span>
                </div>
                <div className="nb-contact-row">
                  <span className="nb-contact-key">Tel</span>
                  <a href="tel:+2349031843486" itemProp="telephone">+234 903 184 3486</a>
                </div>
                <div className="nb-contact-row">
                  <span className="nb-contact-key">Mail</span>
                  <a href="mailto:divinefavourakanbi07@gmail.com" itemProp="email" style={{ wordBreak: 'break-all' }}>
                    divinefavourakanbi07@gmail.com
                  </a>
                </div>

                <div className="nb-social-btns" style={{ marginTop: '1.25rem' }}>
                  <a href="https://github.com/divinefavourak" target="_blank" rel="noopener noreferrer" className="nb-social-btn" aria-label="GitHub">
                    <i className="fab fa-github" aria-hidden="true" />
                  </a>
                  <a href="https://linkedin.com/in/divine-favour-akanbi-999b5b385/" target="_blank" rel="noopener noreferrer" className="nb-social-btn" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in" aria-hidden="true" />
                  </a>
                  <a href="https://x.com/akcodex1" target="_blank" rel="noopener noreferrer" className="nb-social-btn" aria-label="X (Twitter)">
                    <i className="fab fa-x-twitter" aria-hidden="true" />
                  </a>
                  <a href="https://instagram.com/ak.codex" target="_blank" rel="noopener noreferrer" className="nb-social-btn" aria-label="Instagram">
                    <i className="fab fa-instagram" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </NBWindow>
    </div>
  );
}

export default Contact;