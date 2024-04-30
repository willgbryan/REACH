import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tikgwynefswdaacpuqjd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseKey) {
  console.error('Supabase key is not defined. Check your environment variables.');
}

const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const EmailInput = ({ setEmail }) => (
  <input
    className="signup-form__input signup-form__email"
    type="email"
    placeholder="Email"
    onChange={(e) => setEmail(e.target.value)}
  />
);

const PasswordInput = ({ setPassword }) => (
  <input
    className="signup-form__input signup-form__password"
    type="password"
    placeholder="Password"
    onChange={(e) => setPassword(e.target.value)}
  />
);

const SubmitButton = ({ handleSignup, email, password }) => (
  <button
    className="signup-button signup-form__submit signup-form__submit-btn"
    onClick={handleSignup}
    disabled={!email || !password}
  >
    Submit
  </button>
);

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
      <EmailInput setEmail={setEmail} />
      <PasswordInput setPassword={setPassword} />
      <SubmitButton handleSignup={handleSignup} email={email} password={password} />
    </div>
  );
};

const SignupButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => setShowForm(!showForm);
  const handleSignupSuccess = () => setShowForm(false);

  return (
    <>
      {!showForm && <button className="signup-button signup-button__trigger" onClick={handleShowForm}>Sign up</button>}
      <SignupForm isVisible={showForm} onSignupSuccess={handleSignupSuccess} />
    </>
  );
};

export default SignupButton;
