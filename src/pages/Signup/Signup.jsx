import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name,setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate1 = useNavigate();


  const validations = {
    name: false,
    email: false, 
    password: false,
    confirmPassword: false,
  };

  const handleSignup = () => {
    console.log('NAME:',name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img
          src="src/assets/zakapps_logo.jpg" 
          alt="Logo"
          className="signup-logo"
        />
        <h2 className="signup-title">Sign-Up</h2>
        <form className="signup-form">
        <input
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
           <input
            type="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-input"
          />
          <button
            type="button"
            onClick={handleSignup}
            className="signup-button"
          >
           Signup
          </button>
        </form>
        <div className="signup-options">
          <a href=""onClick={()=> navigate1('/')}>Already registered ? Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;