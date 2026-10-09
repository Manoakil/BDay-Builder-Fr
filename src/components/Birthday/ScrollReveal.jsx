import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, direction = 'up' }) {
  // Define animations based on direction
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.17, 0.67, 0.83, 0.67] // Custom spring-like cubic bezier
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
