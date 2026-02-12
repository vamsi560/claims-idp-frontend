// Use public path for lock-login.png

import React, { useState } from 'react';
import './Login.css';

const DUMMY_EMAIL = 'user@fnl.com';
const DUMMY_PASSWORD = 'password123';

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
    <div className="login-outer-container">
      <div className="login-split login-split-left">
        <div className="login-brand-header">
          <img src="/images/lock-login.png" alt="Lock Login" className="login-shield-image" />
        </div>
        <div className="login-secure-text">Claims Work Bench</div>
          <img src="/images/ValueMomentum_logo.png" alt="ValueMomentum Logo" className="login-vm-logo" />
      </div>
      <div className="login-split login-split-right">
        <div className="login-form-card">
          <h2 className="login-form-title">Sign In to Your Account</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email" className="login-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="Email Address"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="login-error" role="alert">{error}</p>
            )}
            <button type="submit" className="login-submit">
              Sign In
            </button>
            <div className="login-forgot">Forgot password?</div>
          </form>
        </div>
      </div>
    </div>
  );
}
