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
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <div className="shield-icon" />
          <div className="login-title">FNL Claims Automation</div>
        </div>
        <div className="login-secure">Secure Login</div>
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In to Your Account</h2>
          <label>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Sign In</button>
          {error && <div className="login-error">{error}</div>}
          <div className="login-forgot">Forgot password?</div>
        </form>
      </div>
    </div>
  );
}
