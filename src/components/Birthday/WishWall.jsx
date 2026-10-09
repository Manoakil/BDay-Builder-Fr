import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WishCard from './WishCard';
import WishModal from './WishModal';
import './WishWall.css';

export default function WishWall({ textWishes }) {
  const [selectedWish, setSelectedWish] = useState(null);

  if (!textWishes || textWishes.length === 0) {
    return (
      <section className="wish-wall-section">
        <div className="wish-wall-header">
          <h2>Wish Wall</h2>
          <p>Words from those who care about you.</p>
        </div>
        <div className="wish-wall-empty">
          <div className="wish-wall-empty-icon">✉</div>
          <div className="wish-wall-empty-text">Your wall is waiting for its first wish.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="wish-wall-section">
      <div className="wish-wall-header">
        <h2>Wish Wall</h2>
        <p>Words from those who care about you.</p>
      </div>

      <div className="masonry-grid">
        {textWishes.map((wish, idx) => (
          <WishCard 
            key={wish.id || idx} 
            wish={wish} 
            index={idx} 
            onClick={setSelectedWish} 
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedWish && (
          <WishModal 
            wish={selectedWish} 
            onClose={() => setSelectedWish(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
