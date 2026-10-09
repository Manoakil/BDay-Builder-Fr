import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

export default function HeroSection({ birthdayName, photoUrl, wishCount, onNavigate }) {
  return (
    <section className="hero-section">
      <nav className="birthday-nav">
        <div className="nav-brand">{birthdayName}'s Birthday</div>
        <ul className="nav-links">
          <li><button onClick={() => onNavigate('home')}>Home</button></li>
          <li><button onClick={() => onNavigate('wishes')}>Wishes</button></li>
          <li><button onClick={() => onNavigate('memories')}>Memories</button></li>
          <li><button onClick={() => onNavigate('timeline')}>Timeline</button></li>
          <li><button onClick={() => onNavigate('vault')}>Vault</button></li>
        </ul>
      </nav>

      <div className="hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Happy Birthday, {birthdayName}.</h1>
          <p className="hero-subtitle">
            Today, you get to see<br/>what people have been keeping for you.
          </p>
          
          <div className="contribution-info">
            <div className="avatar-stack">
              {/* Fake avatars for visual design, ideally these come from props */}
              <div className="avatar" style={{background: '#FF4D8D'}}></div>
              <div className="avatar" style={{background: '#FFD166'}}></div>
              <div className="avatar" style={{background: '#4CAF50'}}></div>
            </div>
            <span className="contribution-text">
              {wishCount} people left something for you.
            </span>
          </div>

          <button className="cta-btn" onClick={() => onNavigate('wishes')}>
            See Your Wishes
          </button>
        </motion.div>

        <motion.div 
          className="hero-image-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {photoUrl ? (
             <img src={photoUrl} alt={birthdayName} className="hero-image" />
          ) : (
             <div className="hero-image-placeholder"></div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
