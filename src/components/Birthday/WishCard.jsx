import React, { useMemo } from "react";
import { motion } from "framer-motion";
import "./WishCard.css";

export default function WishCard({ wish, index, onClick }) {
  // Deterministic random style based on index
  const cardStyle = useMemo(() => {
    const styles = ["postcard", "letter", "envelope"];
    return styles[index % styles.length];
  }, [index]);

  // Deterministic slight rotation (-4 to 4 degrees)
  const rotation = useMemo(() => {
    const angle = (index % 5) * 2 - 4; // -4, -2, 0, 2, 4
    return angle === 0 ? 1 : angle; // Avoid completely flat for organic feel
  }, [index]);

  return (

    <motion.div
      className="wish-card-wrapper"
      onClick={() => onClick(wish)}
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.1,
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        y: -10,
        zIndex: 10,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      style={{
        rotate: rotation,
      }}
      layoutId={`wish-container-${wish.id}`}
    >
      <div
        className={`wish-card-container wish-style-${cardStyle}`}
      >
        {/* Envelope top flap */}
        <div className="wish-card-top-fold"></div>

        {/* Wax seal */}
        <div className="wish-card-wax-seal">
          <span className="wax-seal-icon">♡</span>
        </div>

        {/* Card content */}
        <motion.div
          className="wish-card-content"
          layoutId={`wish-content-${wish.id}`}
        >
          <h3 className="wish-card-name">
            {wish.wisher_name || "Someone special"}
          </h3>

          <div className="wish-card-subtitle">
            Tap to open
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
