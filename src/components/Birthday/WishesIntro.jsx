import React from 'react';
import { motion } from 'framer-motion';
import './WishesIntro.css';

export default function WishesIntro({ totalWishes }) {
  if (totalWishes === 0) return null;

  return (
    <section className="bb-wishes-intro-section" id="wishes">
      <div className="bb-wishes-intro-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="bb-wi-content"
        >
          <h2 className="bb-h2 bb-wi-heading">People wanted to tell you something.</h2>
          
          <div className="bb-wi-subheading">
            <p>Some wrote a few words.</p>
            <p>Some wrote a whole story.</p>
            <p>Some couldn't fit their feelings into words.</p>
          </div>

          <motion.div 
            className="bb-wi-count-wrapper"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
          >
            <span className="bb-wi-count bb-editorial-text">{totalWishes}</span>
            <span className="bb-wi-count-label">people celebrated you today</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
