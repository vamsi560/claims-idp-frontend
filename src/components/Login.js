
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
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-modern-bg">
      <div className="login-modern-panel">
        <img src="/images/ValueMomentum_logo.png" alt="ValueMomentum Logo" className="company-logo-modern" />
        <img src="/images/lock-login.png" alt="Lock" className="lock-icon-modern" />
        <div className="login-modern-title">Claims Workbench</div>
        <form className="login-modern-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Sign In</button>
          {error && <div className="login-modern-error">{error}</div>}
          <div className="login-modern-forgot">Forgot password?</div>
        </form>
      </div>
    </div>
  );
}
