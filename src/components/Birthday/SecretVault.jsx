import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SecretVault.css';

export default function SecretVault({ vault, onUnlock, isOffline }) {
  const [answer, setAnswer] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsUnlocking(true);
    
    // Simulate slight delay for cinematic effect
    await new Promise(r => setTimeout(r, 800));
    
    try {
      await onUnlock(answer);
    } catch (err) {
      setError(true);
      setIsUnlocking(false);
      setTimeout(() => setError(false), 2000);
    }
  };

  // Generate gold particles for unlock success
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 400,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 0.2
  }));

  return (
    <section className="bb-vault-section" id="vault">
      <div className="bb-vault-transition-gradient"></div>
      
      <div className="bb-vault-container">
        
        <AnimatePresence mode="wait">
          {!vault.unlock_time ? (
            <motion.div 
              key="locked"
              className="bb-vault-locked-state"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 1 } }}
            >
              <div className="bb-vault-icon-container">
                <motion.div 
                  className="bb-vault-icon"
                  animate={isUnlocking ? { rotateY: 180, scale: 1.2, filter: "drop-shadow(0 0 20px #FFD166)" } : {}}
                  transition={{ duration: 0.8 }}
                >
                  🔒
                </motion.div>
                {isUnlocking && (
                  <div className="bb-vault-particles">
                    {particles.map(p => (
                      <motion.div
                        key={p.id}
                        className="bb-vault-particle"
                        style={{ width: p.size, height: p.size }}
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{ x: p.x, y: p.y, opacity: 0 }}
                        transition={{ duration: 1 + Math.random(), delay: p.delay }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <span className="bb-label bb-vault-label">There's one more thing.</span>
              <h2 className="bb-h2 bb-vault-heading" style={{color:"#ffffffff"}}>Something was kept just for you.</h2><br/>
              <form onSubmit={handleSubmit} className="bb-vault-form">
                <p className="bb-vault-question">{vault.question}</p>
                <div className={`bb-vault-input-wrapper ${error ? 'bb-vault-error' : ''}`}>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer..."
                    className="bb-vault-input"
                    disabled={isUnlocking}
                  />
                  <button type="submit" className="bb-vault-btn bb-vault-key-btn" disabled={isUnlocking || !answer.trim()} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "28px" }} title="Unlock">
                    <motion.div
                      animate={isUnlocking ? { y: -120, rotate: -45, scale: 1.5, opacity: 0 } : { y: 0, rotate: 0, scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      🗝️
                    </motion.div>
                  </button>
                  
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ color: "#ff4d4f", fontSize: "14px", fontWeight: "bold", textAlign: "center", marginTop: "15px" }}
                    >
                      Wrong key! Try with the correct key to open 🗝️❌
                    </motion.p>
                  )}
                </AnimatePresence>

                <p style={{textAlign:"center", marginTop:"15px",color: "var(--bb-primary)", fontSize:"15px", fontWeight:"bold" }}> Hint : {vault.hint} </p>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="unlocked"
              className="bb-vault-unlocked-state"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <span className="bb-label bb-vault-label" style={{ color: 'var(--bb-secondary)' }}>You found it.</span>
              
              <div className="bb-vault-content-box" style={{ marginTop: '20px' }}>
                <h3 className="bb-editorial-text" style={{ color: '#FFF', fontSize: '2rem', marginBottom: '20px' }}>
                  The vault is open.
                </h3>
                
                {vault.vault_wish && (
                  <div className="bb-vault-wish-content" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
                    {vault.vault_wish.media_url && (
                      <img src={vault.vault_wish.media_url} alt="Secret Wish" style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }} />
                    )}
                    <p style={{ color: '#fbf0dd', fontSize: '1.2rem', whiteSpace: 'pre-wrap', fontFamily: "'Caveat', cursive" }}>
                      {vault.vault_wish.content}
                    </p>
                  </div>
                )}
                
                {isOffline && vault.dynamic_data?.confessionText && (
                  <div style={{ marginTop: '30px' }}>
                    <p style={{ color: '#ff4d8d', fontSize: '1.5rem', fontFamily: "'Caveat', cursive", whiteSpace: 'pre-wrap' }}>
                      {vault.dynamic_data.confessionText}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
