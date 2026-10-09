import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WelcomeScreen.css';

export default function WelcomeScreen({ birthdayName, onEnter }) {
  // Generate random particles for the background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
  }));

  return (
    <AnimatePresence>
      <motion.section 
        className="bb-welcome-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* Subtle background grain via CSS */}
        <div className="bb-grain-overlay"></div>
        
        {/* Floating golden particles */}
        <div className="bb-particles-container">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="bb-particle"
              style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
              animate={{ 
                y: [0, -30, 0],
                opacity: [0.1, 0.6, 0.1]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="bb-welcome-content">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="bb-welcome-top"
          >
            <span className="bb-greeting-small">Hey, {birthdayName}.</span>
            <span className="bb-greeting-sub">Today isn't just another day.</span>
          </motion.div>
          
          <motion.h1 
            className="bb-welcome-hero bb-editorial-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.2 }}
          >
            Today is yours.
          </motion.h1>

          <motion.p
            className="bb-welcome-context"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            And someone made sure you wouldn't celebrate it alone.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="bb-welcome-action"
          >
            <button className="bb-btn-primary" onClick={onEnter} style={{
              paddingLeft:'20px',
paddingRight:'20px',color:"rgba(0, 0, 0, 1)"
            }}>
              Open Your Birthday <span className="btn-sparkle" >✦</span>
            </button>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
