import React, { useState } from "react";
import SocialLinks from "../components/SocialLinks";
import FadeIn from "../components/FadeIn.jsx";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          submitting: false,
          success: true,
          error: null
        });
        // Clear form
        setFormData({ name: "", email: "", message: "" });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus(prev => ({ ...prev, success: false }));
        }, 5000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: error.message || "Something went wrong. Please try again."
      });
    }
  };

  return (
    <main className="container">
      <div className="terminal-window">
        <h1 style={{ marginBottom: "2rem" }}>&gt; Initiate_Connection</h1>

        <FadeIn delay={100}>
          <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
            <div className="form-group">
              <label style={{ display: "block", color: "#888", marginBottom: "5px", fontSize: "0.9rem" }}>
                // ENTER ID (NAME)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Guest_User"
                required
                disabled={status.submitting}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", color: "#888", marginBottom: "5px", fontSize: "0.9rem" }}>
                // ENTER FREQUENCY (EMAIL)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="user@domain.com"
                required
                disabled={status.submitting}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", color: "#888", marginBottom: "5px", fontSize: "0.9rem" }}>
                // DATA PACKET (MESSAGE)
              </label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                placeholder="Type your message here..."
                required
                disabled={status.submitting}
              ></textarea>
            </div>

            {/* Success Message */}
            {status.success && (
              <div style={{
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid #00ff88",
                backgroundColor: "rgba(0, 255, 136, 0.1)",
                color: "#00ff88",
                borderRadius: "4px"
              }}>
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}

            {/* Error Message */}
            {status.error && (
              <div style={{
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid #ff4444",
                backgroundColor: "rgba(255, 68, 68, 0.1)",
                color: "#ff4444",
                borderRadius: "4px"
              }}>
                ✗ {status.error}
              </div>
            )}

            <button type="submit" className="btn" disabled={status.submitting}>
              {status.submitting ? "> SENDING..." : "> SEND_TRANSMISSION"}
            </button>
          </form>
        </FadeIn>

        <FadeIn delay={200}>
          <div style={{ marginTop: "3rem", borderTop: "1px dashed #444", paddingTop: "1rem" }}>
            <p><strong>Loc:</strong> Lagos, Nigeria</p>
            <p><strong>Tel:</strong> +234 903 184 3486</p>
            <p><strong>Mail:</strong> divinefavourakanbi07@gmail.com</p>
            <SocialLinks />
          </div>
        </FadeIn>
      </div>
    </main>
  );
}

export default Contact;