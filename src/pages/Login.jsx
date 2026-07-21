import React, { useState } from "react";
import NBWindow from "../components/NBWindow.jsx";
import FadeIn from "../components/FadeIn.jsx";
import { useExamLoginOpen } from "../utils/examAccess.js";

const EXAM_FORM_URL = "https://bit.ly/NigeriaGenKnow";

function Login() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const loginOpen = useExamLoginOpen();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = EXAM_FORM_URL;
  };

  if (!loginOpen) {
    return (
      <div style={{ maxWidth: "420px", margin: "4rem auto", textAlign: "center", padding: "0 1rem" }}>
        <p style={{ fontSize: "1.1rem" }}>Login has closed. This link is no longer accepting entries.</p>
      </div>
    );
  }

  return (
    <div className="nb-section-wrap">
      <NBWindow title="LOGIN.EXE" accent="--yellow">
        <p className="nb-dir-header">
          {">"} verify_identity &nbsp;— enter your details to continue
        </p>

        <FadeIn delay={100}>
          <form onSubmit={handleSubmit} noValidate style={{ maxWidth: "420px", margin: "0 auto" }}>
            <div className="nb-form-group">
              <label htmlFor="login-name" className="nb-label">// Full Name</label>
              <input
                id="login-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="nb-input"
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </div>

            <div className="nb-form-group">
              <label htmlFor="login-email" className="nb-label">// Email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="nb-input"
                placeholder="user@domain.com"
                required
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="nb-btn nb-btn-inv nb-btn-full"
              style={{ marginTop: "0.25rem" }}
            >
              &gt; LOGIN &amp; CONTINUE
            </button>
          </form>
        </FadeIn>
      </NBWindow>
    </div>
  );
}

export default Login;
