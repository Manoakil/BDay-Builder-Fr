import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MemoryTimeline.css";

const MemoryTimeline = ({ memories = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const timelineRef = useRef(null);

  /*
   * Format the memory date.
   *
   * Supported examples:
   * 2020
   * 2020-05
   * 2020-05-20
   * precision: "year"
   * precision: "month"
   */
  const formatDate = (memory) => {
    if (!memory) return "";

    // Explicit display date
    if (memory.displayDate) {
      return memory.displayDate;
    }

    const dateValue = memory.date || memory.memory_date;

    if (!dateValue) {
      return "";
    }

    // If only year is provided
    if (
      memory.precision === "year" ||
      /^\d{4}$/.test(String(dateValue))
    ) {
      return String(dateValue).substring(0, 4);
    }

    const dateString = String(dateValue);

    // YYYY-MM
    if (
      memory.precision === "month" ||
      /^\d{4}-\d{2}$/.test(dateString)
    ) {
      const [year, month] = dateString.split("-");

      const date = new Date(
        Number(year),
        Number(month) - 1,
        1
      );

      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    // Full date
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /*
   * Find media from different possible data structures.
   */
  const getMedia = (memory) => {
    if (!memory) return null;

    if (memory.media) {
      if (typeof memory.media === "string") {
        return {
          type: "image",
          url: memory.media,
        };
      }

      return memory.media;
    }

    if (memory.image) {
      return {
        type: "image",
        url: memory.image,
      };
    }

    if (memory.image_url) {
      return {
        type: "image",
        url: memory.image_url,
      };
    }

    if (memory.video) {
      return {
        type: "video",
        url: memory.video,
      };
    }

    if (memory.video_url) {
      return {
        type: "video",
        url: memory.video_url,
      };
    }

    return null;
  };

  /*
   * Open media viewer
   */
  const openMedia = (memory, index) => {
    const media = getMedia(memory);

    if (!media) return;

    setCurrentIndex(index);

    setSelectedMedia({
      ...media,
      memory,
    });
  };

  /*
   * Close media viewer
   */
  const closeMedia = () => {
    setSelectedMedia(null);
  };

  /*
   * Keyboard support
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedMedia) return;

      if (event.key === "Escape") {
        closeMedia();
      }

      if (event.key === "ArrowRight") {
        const nextIndex = Math.min(
          currentIndex + 1,
          memories.length - 1
        );

        if (nextIndex !== currentIndex) {
          const nextMemory = memories[nextIndex];

          setCurrentIndex(nextIndex);

          const media = getMedia(nextMemory);

          if (media) {
            setSelectedMedia({
              ...media,
              memory: nextMemory,
            });
          }
        }
      }

      if (event.key === "ArrowLeft") {
        const previousIndex = Math.max(
          currentIndex - 1,
          0
        );

        if (previousIndex !== currentIndex) {
          const previousMemory = memories[previousIndex];

          setCurrentIndex(previousIndex);

          const media = getMedia(previousMemory);

          if (media) {
            setSelectedMedia({
              ...media,
              memory: previousMemory,
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedMedia, currentIndex, memories]);

  /*
   * Prevent background scrolling while viewer is open.
   */
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMedia]);

  /*
   * Detect currently visible timeline memory.
   *
   * This keeps the glowing marker synchronized
   * when the user scrolls horizontally.
   */
  useEffect(() => {
    const container = timelineRef.current;

    if (!container || memories.length === 0) {
      return;
    }

    const handleScroll = () => {
      const nodes = container.querySelectorAll(
        ".bb-timeline-node"
      );

      if (!nodes.length) return;

      const containerRect =
        container.getBoundingClientRect();

      const center =
        containerRect.left +
        containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();

        const nodeCenter =
          rect.left + rect.width / 2;

        const distance = Math.abs(
          nodeCenter - center
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex(closestIndex);
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [memories]);

  if (!memories || memories.length === 0) {
    return (
      <section className="bb-timeline-section">
        <div className="bb-timeline-empty">
          <span className="bb-empty-icon">✦</span>
          <p>No memories added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="bb-timeline-section"
        ref={timelineRef}
      >
        <div className="bb-timeline-wrapper">

          {/* Heading */}
          <div className="bb-timeline-heading">
            <span className="bb-timeline-eyebrow">
              A LIFE IN MOMENTS
            </span>

            <h2 className="bb-timeline-title">
              Memory Lane
            </h2>

            <p className="bb-timeline-subtitle">
              Little moments that became beautiful memories.
            </p>
          </div>

          {/* Timeline */}
          <div className="bb-timeline-container">

            {/* Main horizontal line */}
            <div className="bb-timeline-line-track">
              <motion.div
                className="bb-timeline-line-fill"
                initial={{ width: "0%" }}
                animate={{
                  width:
                    memories.length > 1
                      ? `${(currentIndex /
                          (memories.length - 1)) *
                          100}%`
                      : "100%",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />
            </div>

            {/* Timeline nodes */}
            <div className="bb-timeline-nodes">

              {memories.map((memory, index) => {

                /*
                 * IMPORTANT:
                 * This fixes the ESLint error:
                 *
                 * 'isTop' is not defined
                 *
                 * Even indexes appear above the timeline.
                 * Odd indexes appear below the timeline.
                 */
                const isTop = index % 2 === 0;

                const isCurrent =
                  index === currentIndex;

                const media = getMedia(memory);

                return (
                  <motion.div
                    key={
                      memory.id ||
                      memory._id ||
                      `memory-${index}`
                    }
                    className={`bb-timeline-node ${
                      isTop
                        ? "bb-node-top"
                        : "bb-node-bottom"
                    } ${
                      isCurrent
                        ? "bb-node-current"
                        : ""
                    }`}
                    initial={{
                      opacity: 0,
                      y: isTop ? -30 : 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.25,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                    }}
                    onClick={() =>
                      setCurrentIndex(index)
                    }
                  >

                    {/* TOP CONTENT */}
                    {isTop && (
                      <div className="bb-node-content">

                        <div className="bb-node-date">
                          {formatDate(memory)}
                        </div>

                        {memory.title && (
                          <h3 className="bb-node-title">
                            {memory.title}
                          </h3>
                        )}

                        {memory.description && (
                          <p className="bb-node-desc">
                            {memory.description}
                          </p>
                        )}

                        {media && (
                          <div
                            className={`bb-node-media ${
                              isCurrent
                                ? "bb-media-large"
                                : "bb-media-small"
                            }`}
                            onClick={(event) => {
                              event.stopPropagation();
                              openMedia(
                                memory,
                                index
                              );
                            }}
                          >

                            {media.type === "video" ? (
                              <div className="bb-media-video-wrapper">

                                <video
                                  src={media.url}
                                  className="bb-media-image"
                                  muted
                                  playsInline
                                  preload="metadata"
                                />

                                <div className="bb-media-play-icon">
                                  ▶
                                </div>

                              </div>
                            ) : (
                              <img
                                src={media.url}
                                alt={
                                  memory.title ||
                                  "Memory"
                                }
                                className="bb-media-image"
                              />
                            )}

                          </div>
                        )}

                      </div>
                    )}

                    {/* TIMELINE MARKER */}
                    <div className="bb-node-marker">

                      <motion.div
                        className="bb-node-dot"
                        animate={
                          isCurrent
                            ? {
                                scale: [
                                  1,
                                  1.25,
                                  1,
                                ],
                                boxShadow: [
                                  "0 0 0 rgba(255,77,141,0)",
                                  "0 0 25px rgba(255,77,141,0.8)",
                                  "0 0 0 rgba(255,77,141,0)",
                                ],
                              }
                            : {
                                scale: 1,
                                boxShadow:
                                  "none",
                              }
                        }
                        transition={
                          isCurrent
                            ? {
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                            : {
                                duration: 0.2,
                              }
                        }
                      >
                        {isCurrent ? "✦" : ""}
                      </motion.div>

                    </div>

                    {/* BOTTOM CONTENT */}
                    {!isTop && (
                      <div className="bb-node-content">

                        <div className="bb-node-date">
                          {formatDate(memory)}
                        </div>

                        {memory.title && (
                          <h3 className="bb-node-title">
                            {memory.title}
                          </h3>
                        )}

                        {memory.description && (
                          <p className="bb-node-desc">
                            {memory.description}
                          </p>
                        )}

                        {media && (
                          <div
                            className={`bb-node-media ${
                              isCurrent
                                ? "bb-media-large"
                                : "bb-media-small"
                            }`}
                            onClick={(event) => {
                              event.stopPropagation();
                              openMedia(
                                memory,
                                index
                              );
                            }}
                          >

                            {media.type === "video" ? (
                              <div className="bb-media-video-wrapper">

                                <video
                                  src={media.url}
                                  className="bb-media-image"
                                  muted
                                  playsInline
                                  preload="metadata"
                                />

                                <div className="bb-media-play-icon">
                                  ▶
                                </div>

                              </div>
                            ) : (
                              <img
                                src={media.url}
                                alt={
                                  memory.title ||
                                  "Memory"
                                }
                                className="bb-media-image"
                              />
                            )}

                          </div>
                        )}

                      </div>
                    )}

                  </motion.div>
                );
              })}

            </div>
          </div>

          {/* Mobile swipe hint */}
          <div className="bb-timeline-swipe-hint">
            <span>←</span>
            <span>Swipe to explore memories</span>
            <span>→</span>
          </div>

        </div>
      </section>

      {/* ============================
          FULLSCREEN MEDIA VIEWER
         ============================ */}

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="bb-media-viewer"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={closeMedia}
          >

            <motion.div
              className="bb-media-viewer-content"
              initial={{
                scale: 0.85,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.85,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* Close */}
              <button
                type="button"
                className="bb-media-viewer-close"
                onClick={closeMedia}
                aria-label="Close"
              >
                ×
              </button>

              {/* Previous */}
              {currentIndex > 0 && (
                <button
                  type="button"
                  className="bb-media-viewer-prev"
                  onClick={() => {
                    const newIndex =
                      currentIndex - 1;

                    const memory =
                      memories[newIndex];

                    const media =
                      getMedia(memory);

                    if (media) {
                      setCurrentIndex(
                        newIndex
                      );

                      setSelectedMedia({
                        ...media,
                        memory,
                      });
                    }
                  }}
                  aria-label="Previous memory"
                >
                  ‹
                </button>
              )}

              {/* Media */}
              <div className="bb-media-viewer-media">

                {selectedMedia.type === "video" ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="bb-viewer-video"
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={
                      selectedMedia.memory?.title ||
                      "Memory"
                    }
                    className="bb-viewer-image"
                  />
                )}

              </div>

              {/* Next */}
              {currentIndex <
                memories.length - 1 && (
                <button
                  type="button"
                  className="bb-media-viewer-next"
                  onClick={() => {
                    const newIndex =
                      currentIndex + 1;

                    const memory =
                      memories[newIndex];

                    const media =
                      getMedia(memory);

                    if (media) {
                      setCurrentIndex(
                        newIndex
                      );

                      setSelectedMedia({
                        ...media,
                        memory,
                      });
                    }
                  }}
                  aria-label="Next memory"
                >
                  ›
                </button>
              )}

              {/* Viewer information */}
              {selectedMedia.memory && (
                <div className="bb-media-viewer-info">

                  {formatDate(
                    selectedMedia.memory
                  ) && (
                    <div className="bb-viewer-date">
                      {formatDate(
                        selectedMedia.memory
                      )}
                    </div>
                  )}

                  {selectedMedia.memory.title && (
                    <h3>
                      {
                        selectedMedia.memory
                          .title
                      }
                    </h3>
                  )}

                  {selectedMedia.memory
                    .description && (
                    <p>
                      {
                        selectedMedia.memory
                          .description
                      }
                    </p>
                  )}

                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MemoryTimeline;