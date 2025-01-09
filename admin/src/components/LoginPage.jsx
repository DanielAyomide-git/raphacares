import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard/analytics');
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <label>Email:</label>
        <input type="email" placeholder="Enter your email" required />
        <label>Password:</label>
        <input type="password" placeholder="Enter your password" required />
        <button type="submit">Login</button>
        <div className="links">
          <a href="#">Forgot Password?</a>
          <a href="#">Register</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
