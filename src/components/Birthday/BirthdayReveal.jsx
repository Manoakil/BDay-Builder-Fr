import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BirthdayReveal.css';

export default function BirthdayReveal({ birthdayName, onComplete }) {
  const [phase, setPhase] = useState('candle'); // candle -> countdown-3 -> countdown-2 -> countdown-1 -> reveal
  const [candleBlown, setCandleBlown] = useState(false);

  const startCelebration = async () => {
    setCandleBlown(true);
    // Slight pause after blowing the candle
    await new Promise(r => setTimeout(r, 1500));
    
    setPhase('countdown-3');
    await new Promise(r => setTimeout(r, 1200));
    setPhase('countdown-2');
    await new Promise(r => setTimeout(r, 1200));
    setPhase('countdown-1');
    await new Promise(r => setTimeout(r, 1200));
    setPhase('reveal');
    
    // Complete the reveal and transition to main content
    await new Promise(r => setTimeout(r, 4500));
    onComplete();
  };

  // Grand Confetti explosion
  const colors = ['#ff4d8d', '#ffd166', '#4dffb8', '#b84dff', '#ff8a00'];
  const particles = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 1500,
    y: (Math.random() - 0.5) * 1500,
    size: Math.random() * 15 + 5,
    delay: Math.random() * 0.2,
    rotation: Math.random() * 720,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.random() > 0.5 ? '50%' : '2px'
  }));

  return (
    <motion.section 
      className="bb-reveal-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <div className="bb-grain-overlay"></div>
      
      <AnimatePresence mode="wait">
        
        {phase === 'candle' && (
          <motion.div
            key="candle"
            className="bb-candle-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <motion.h2 
              className="bb-candle-text bb-editorial-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Take a breath. <br/> Make a wish.
            </motion.h2>

            <div className="bb-cake-wrapper">
              <div className="bb-cake">
                <div className="bb-cake-icing"></div>
                <div className="bb-cake-layer bb-cake-top"></div>
                <div className="bb-cake-layer bb-cake-bottom"></div>
                
                <div className="bb-candle-body">
                  <div className="bb-candle-wick"></div>
                  <div className={`bb-candle-flame ${candleBlown ? 'bb-flame-blown' : ''}`}>
                    <div className="bb-flame-glow"></div>
                  </div>
                  {candleBlown && <div className="bb-smoke-particle"></div>}
                </div>
              </div>
              <div className="bb-cake-plate"></div>
            </div>

            <motion.button 
              className="bb-btn-primary bb-blow-btn"
              onClick={startCelebration}
              disabled={candleBlown}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: candleBlown ? 0 : 1 }}
              transition={{ delay: 2, duration: 1 }}
              style={{color:"rgba(0, 0, 0, 1)",paddingLeft:'30px',paddingRight:'30px',paddingTop:'12px',paddingBottom:'12px', fontSize: '1.2rem', fontFamily: 'var(--bb-font-editorial)', marginTop: '2rem'}}
            >
              Make a Wish ✦
            </motion.button>
          </motion.div>
        )}

        {phase.startsWith('countdown') && (
          <motion.div
            key={phase}
            className="bb-countdown-number"
            initial={{ opacity: 0, scale: 0.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {phase.split('-')[1]}
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div 
            key="reveal" 
            className="bb-reveal-content"
          >
            {/* Flash Effect */}
            <motion.div 
              className="bb-reveal-flash"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Confetti explosion */}
            <div className="bb-explosion-container">
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  className="bb-explosion-particle"
                  style={{ 
                    width: p.size, 
                    height: p.size,
                    backgroundColor: p.color,
                    borderRadius: p.shape,
                    boxShadow: `0 0 10px ${p.color}`
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
                  animate={{ 
                    x: p.x, 
                    y: p.y, 
                    opacity: 0,
                    rotate: p.rotation,
                    scale: 1
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    ease: "easeOut",
                    delay: p.delay
                  }}
                />
              ))}
            </div>

            <motion.h1 
              className="bb-reveal-text bb-editorial-text"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 0.2 }}
            >
              Happy Birthday,<br/>
              <span className="bb-reveal-name">{birthdayName}</span>
              <span className="bb-reveal-sparkle">✦</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}