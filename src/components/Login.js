import React, { useState } from 'react';
import './Login.css';

const DUMMY_EMAIL = 'user@fnl.com';
const DUMMY_PASSWORD = 'password123';

function ClaimIcon() {
  return (
    <svg className="login-hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-hero">
          <ClaimIcon />
          <h1 className="login-title">Claims Workbench</h1>
          <p className="login-tagline">Sign in to manage and process claims in one place.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email" className="login-label">Email</label>
          <input
            id="login-email"
            type="email"
            className="login-input"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <label htmlFor="login-password" className="login-label">Password</label>
          <input
            id="login-password"
            type="password"
            className="login-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && (
            <p className="login-error" role="alert">{error}</p>
          )}
          <button type="submit" className="login-submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
