import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="landing">
      <div className="content">
        <div className="top-text">[OLD] INDUSTRY // NEW TECH.</div>
        <h1 className="landing-title">
          <span className="text-highlight">REACH</span>
          <span className="version-tag"><span className="version-number">v0.01</span></span>
          <span className="main-text">THE AI CONSULTANT.</span>
        </h1>
        <div className="bottom-text">NEW PROBLEMS // NEW SOLUTIONS.</div>
        <div className="reach">LET'S EXTEND YOUR REACH.</div>
        <div className="down-arrow">⌄</div>
      </div>
    </header>
  );
}

export default Header;
