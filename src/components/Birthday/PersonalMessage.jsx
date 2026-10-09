import React from 'react';
import { motion } from 'framer-motion';
import './PersonalMessage.css';

export default function PersonalMessage({ message }) {
  const defaultMessage = [
    "You've spent so much time making other people's days brighter.",
    "Today, let us return the favor."
  ];

  const lines = message ? message.split('\n').filter(l => l.trim()) : defaultMessage;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  return (
    <section className="bb-personal-message-section">
      <div className="bb-pm-container">
        <motion.div 
          className="bb-pm-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="bb-label bb-pm-label">A LITTLE NOTE FOR YOU</span>
          <h2 className="bb-h2 bb-pm-title">Before you see everything...</h2>
        </motion.div>

        <motion.div 
          className="bb-pm-body"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {lines.map((line, idx) => (
            <motion.p key={idx} variants={lineVariants} className="bb-pm-line">
              {line}
            </motion.p>
          ))}
          
          <motion.div variants={lineVariants} className="bb-pm-signature-wrapper">
            <p className="bb-pm-signature">— From the people who love having you around ♡</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
