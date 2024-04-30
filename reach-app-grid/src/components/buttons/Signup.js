import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tikgwynefswdaacpuqjd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseKey) {
  console.error('Supabase key is not defined. Check your environment variables.');
}

const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const SignupForm = ({ isVisible, onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      console.error('Email or password is missing.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error.message);
      alert('Signup error: ' + error.message);
    } else {
      alert('Signup successful. Please check your email to verify your account.');
      onSignupSuccess();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="signup-form">
      <input
        className="signup-form__input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="signup-form__input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="signup-button signup-form__submit" onClick={handleSignup} disabled={!email || !password}>
        <i className={`arrow ${email && password ? 'active' : ''}`}></i>
      </button>
    </div>
  );
};

const SignupButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => setShowForm(!showForm);
  const handleSignupSuccess = () => setShowForm(false);

  return (
    <div>
      <button className="signup-button" onClick={handleShowForm}>Sign up</button>
      <SignupForm isVisible={showForm} onSignupSuccess={handleSignupSuccess} />
    </div>
  );
};

export default SignupButton;
