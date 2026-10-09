import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./WishModal.css";

export default function WishModal({ wish, onClose }) {
  const [showLetter, setShowLetter] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (!wish) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [wish, onClose]);

  if (!wish) return null;

  // Split content into paragraphs
  const rawParagraphs = (wish.content || "").split("\n").filter((p) => p.trim() !== "");
  
  // If the message is long, we can split it. Otherwise, if it's short (1-2 paragraphs), just show it all.
  let firstHalf = rawParagraphs;
  let secondHalf = [];
  
  if (rawParagraphs.length > 1) {
    const halfLength = Math.ceil(rawParagraphs.length / 2);
    firstHalf = rawParagraphs.slice(0, halfLength);
    secondHalf = rawParagraphs.slice(halfLength);
  } else if (rawParagraphs.length === 1 && rawParagraphs[0].length > 100) {
    const text = rawParagraphs[0];
    const midpoint = Math.floor(text.length / 2);
    // Try to split cleanly at a space near the middle
    const splitIndex = text.indexOf(" ", midpoint);
    if (splitIndex !== -1) {
      firstHalf = [text.substring(0, splitIndex)];
      secondHalf = [text.substring(splitIndex + 1)];
    } else {
      firstHalf = [text];
    }
  }

  return (
    <motion.div
      className="wish-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="wish-modal-container"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button
          className="wish-modal-close"
          onClick={onClose}
          aria-label="Close wish"
        >
          ×
        </button>

        <div className="bb-letter-top">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>

        <div className="bb-letter-body">
          <div className="bb-letter-greeting">To dear soul,</div>

          {firstHalf.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {!showLetter && secondHalf.length > 0 ? (
            <button
              className="bb-reveal-letter"
              onClick={() => setShowLetter(true)}
            >
              <span>Open the rest of my heart</span>
              <b>♡</b>
            </button>
          ) : (
            <div className="bb-hidden-letter">
              {secondHalf.map((paragraph, index) => (
                <p key={`second-${index}`}>{paragraph}</p>
              ))}

              <div className="bb-signature">
                — {wish.wisher_name || "Someone special"}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}