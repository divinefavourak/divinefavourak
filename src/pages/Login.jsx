import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NBWindow from "../components/NBWindow.jsx";
import FadeIn from "../components/FadeIn.jsx";
import { useExamLoginOpen } from "../utils/examAccess.js";
import { QUIZ_USER_KEY } from "./Quiz.jsx";

const DEFAULT_PASSWORD = "Exam123";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const loginOpen = useExamLoginOpen();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = formData.username.trim();

    if (!username) {
      setError("Enter your name.");
      return;
    }
    if (formData.password !== DEFAULT_PASSWORD) {
      setError("Incorrect password.");
      return;
    }

    sessionStorage.setItem(QUIZ_USER_KEY, username);
    navigate("/quiz");
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
              <label htmlFor="login-username" className="nb-label">// Username</label>
              <input
                id="login-username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="nb-input"
                placeholder="Your name"
                required
                autoComplete="username"
              />
            </div>

            <div className="nb-form-group">
              <label htmlFor="login-password" className="nb-label">// Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="nb-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="nb-form-error" role="alert">
                ✗ {error}
              </div>
            )}

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
