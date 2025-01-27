import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validations = {
    email: false, 
    password: false,
  };

  const handleLogin = () => {
    // console.log('Email:', email);
    // console.log('Password:', password);
    if(email && password != null){
      navigate('/Dashboard')
    }
    else{
      alert('Please enter email and password')
    }
    
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="src/assets/zakapps_logo.jpg" 
          alt="Logo"
          className="login-logo"
        />
        <h2 className="login-title">Login</h2>
        <form className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button
            type="button"
            href='#'
            onClick={handleLogin}
            className="login-button"
          >
            Login
          </button>
        </form>
        <div className="login-options">
          <a href="/forgot-password">Forgot Password?</a>
          <a href=""onClick={()=> navigate('/Signup')}>Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;