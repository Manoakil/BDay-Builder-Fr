import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollDecorations() {
  const [items, setItems] = useState([]);
  
  // Throttle variable to avoid creating too many elements
  let lastScroll = 0;
  let scrollThreshold = 100; // spawn every 100px of scroll

  const emojis = ['✦', '✨', '💐', '🎂', '💖', '🎉', '🦋', '🌸'];

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (Math.abs(currentScroll - lastScroll) > scrollThreshold) {
        lastScroll = currentScroll;

        // Spawn a new decoration
        const newItem = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1, // Random X within 10-90% width
          y: currentScroll + window.innerHeight - 50, // Spawn near bottom of current viewport
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: Math.random() * 20 + 20, // 20-40px
          rotation: Math.random() * 360,
        };

        setItems(prev => {
          const newItems = [...prev, newItem];
          // Keep only the last 15 items to prevent DOM overload
          if (newItems.length > 15) return newItems.slice(newItems.length - 15);
          return newItems;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: item.x, y: item.y - window.scrollY + 100, rotate: item.rotation, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: item.y - window.scrollY - 300, 
              rotate: item.rotation + 90,
              scale: 1
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              fontSize: item.size,
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            onAnimationComplete={() => {
              // Optionally cleanup completed items, but keeping the array length clamped is usually enough
              setItems(prev => prev.filter(i => i.id !== item.id));
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
