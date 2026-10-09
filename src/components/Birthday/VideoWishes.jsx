import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VideoWishes.css';

export default function VideoWishes({ videoWishes }) {
  const [activeVideo, setActiveVideo] = useState(null);

  if (!videoWishes || videoWishes.length === 0) return null;

  return (
    <section className="bb-video-section">
      <div className="bb-video-container">
        <motion.div 
          className="bb-video-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="bb-h2 bb-video-heading">Some people wanted to say it instead.</h2>
        </motion.div>

        <div className="bb-video-grid">
          {videoWishes.map((wish, idx) => (
            <motion.div 
              key={wish.id}
              className="bb-video-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveVideo(wish)}
              whileHover={{ y: -5 }}
            >
              <div className="bb-video-thumbnail">
                {/* Fallback thumbnail if none provided by backend */}
                <div className="bb-video-thumbnail-placeholder" style={{
                  backgroundImage: `url(${wish.media_url ? wish.media_url : ''})`
                }}></div>
                <div className="bb-video-play-overlay">
                  <div className="bb-play-icon">▶</div>
                </div>
              </div>
              <div className="bb-video-info">
                <div className="bb-video-avatar">
                  {wish.wisher_name ? wish.wisher_name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="bb-video-name">{wish.wisher_name || "A friend"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            className="bb-video-modal-overlay bb-glass-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div 
              className="bb-video-modal-content"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="bb-video-close" onClick={() => setActiveVideo(null)}>×</button>
              
              <div className="bb-video-player-wrapper">
                <video 
                  src={activeVideo.media_url} 
                  className="bb-video-player"
                  controls 
                  autoPlay 
                  playsInline
                />
              </div>
              
              <div className="bb-video-modal-info">
                <h3 className="bb-editorial-text">{activeVideo.wisher_name || "A friend"}</h3>
                {activeVideo.content && <p>{activeVideo.content}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
