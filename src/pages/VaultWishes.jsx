import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/VaultWishes.css";
import { getBirthdayVault } from "../service/wishService";

import ScrollReveal from "../components/Birthday/ScrollReveal";
import WishCard from "../components/Birthday/WishCard";
import WishModal from "../components/Birthday/WishModal";
import { AnimatePresence } from "framer-motion";

function VaultWishes({ isOffline, offlineVaultData, offlineEventData, onBack }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [vaultData, setVaultData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [started, setStarted] = useState(false);
  const [activeMemory, setActiveMemory] = useState(null);
  const [revealedThings, setRevealedThings] = useState([]);
  const [showLetter, setShowLetter] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedWish, setSelectedWish] = useState(null);

  const timelineRef = useRef(null);
  const noCountRef = useRef(0);
  const noButtonRef = useRef(null);

  useEffect(() => {
    if (isOffline) {
      setVaultData(offlineVaultData);
      setEventData(offlineEventData);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [vault, evRes, wisherRes, secretWishesData] = await Promise.all([
          getBirthdayVault(eventId).catch(() => null),
          fetch(`http://localhost:8000/api/v1/events/my-birthday-event`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
          }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`http://localhost:8000/api/v1/events/my-wisher-access`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
          }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`http://localhost:8000/api/v1/wishes/birthday-person-vault`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
          }).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);
        if (vault) {
          setVaultData({ ...vault, secret_wishes: secretWishesData || [] });
        }

        // Find best fallback name and slug
        let bestName = "Her Name";
        let bestSlug = "";

        if (evRes) {
          if (evRes.birthday_person_name) bestName = evRes.birthday_person_name;
          if (evRes.slug) bestSlug = evRes.slug;
        } else if (wisherRes && wisherRes.event) {
          if (wisherRes.event.birthday_person_name) bestName = wisherRes.event.birthday_person_name;
          if (wisherRes.event.slug) bestSlug = wisherRes.event.slug;
        }

        setEventData({ birthday_person_name: bestName, slug: bestSlug });

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId, isOffline, offlineVaultData, offlineEventData]);

  useEffect(() => {
    document.body.classList.toggle("bb-lock", !started);
    return () => {
      document.body.classList.remove("bb-lock");
    };
  }, [started]);

  if (loading) return <div style={{ color: 'black', textAlign: 'center', marginTop: '20vh' }}>Loading...</div>;
  if (!vaultData) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Vault not found</div>;

  const dynamic = vaultData.dynamic_data || {};
  const fallbackBdayName = eventData?.birthday_person_name || "Her Name";
  const HER_NAME = dynamic.bday_girl_name || fallbackBdayName;
  const YOUR_NAME = dynamic.wisher_name || "Your Name";
  const timeline = dynamic.timeline || [];
  const littleThings = dynamic.littleThings || [];
  const letterParagraphs = dynamic.letterParagraphs || [];
  const flowerLine1 = dynamic.flowerLine1 || "If I had a flower for every time I thought of you...";
  const flowerLine2 = dynamic.flowerLine2 || "{flowerLine2}";
  const confessionText = dynamic.confessionText || "I've been wanting to tell you something for a while.";
  const proposalQuestion = dynamic.proposalQuestion || "Would you let me love you a little more than just a best friend?";
  const photos = dynamic.photos || ["/images/memory-01.jpg", "/images/memory-02.jpg", "/images/memory-03.jpg", "/images/memory-04.jpg"];


  const revealThing = (index) => {
    if (!revealedThings.includes(index)) {
      setRevealedThings((prev) => [...prev, index]);
    }
  };

  const scrollTimeline = (direction) => {
    if (!timelineRef.current) return;
    timelineRef.current.scrollBy({
      left: direction === "next" ? 420 : -420,
      behavior: "smooth",
    });
  };

  const submitAnswer = async (ans) => {
    try {
      if (!isOffline) {
        await fetch(`http://localhost:8000/api/v1/vault/${vaultData.id}/confess`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify({ answer: ans })
        });
      }
      localStorage.setItem("confessionAnswer", ans);
    } catch (e) {
      console.error(e);
    }
  };

  const handleYes = () => {
    setAnswer("yes");
    setShowCelebration(true);
    submitAnswer("yes");
    setTimeout(() => {
      document.getElementById("ending")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNoHover = () => {
    noCountRef.current += 1;
    if (noCountRef.current >= 100) {
      setAnswer("hate");
      submitAnswer("hate");
      return;
    }
    if (noButtonRef.current) {
      const x = Math.floor(Math.random() * 200) - 100; // -100px to 100px
      const y = Math.floor(Math.random() * 100) - 50;  // -50px to 50px
      noButtonRef.current.style.transform = `translate(${x}px, ${y}px)`;
      noButtonRef.current.style.transition = 'all 0.2s ease';
      noButtonRef.current.style.zIndex = '100';
    }
  };

  const handleTime = () => {
    setAnswer("time");
    submitAnswer("time");
  };


  return (
    <main className="bb-page">

      {/* ================================================================
          OPENING
      ================================================================= */}

      {!started && (
        <section className="bb-opening">
          <div className="bb-opening-noise" />

          <div className="bb-opening-content">

            <div className="bb-opening-stamp">
              SPECIAL DELIVERY
            </div>

            <p className="bb-small-label">
              FOR SOMEONE VERY SPECIAL
            </p>

            <h1>
              Hey, <span>{HER_NAME}</span>...
            </h1>

            <p className="bb-opening-text">
              I made you something.
              <br />
              Please don't rush through it.
            </p>

            <div className="bb-envelope-wrap">

              <div className="bb-envelope">
                <div className="bb-envelope-flap" />

                <div className="bb-letter-preview">
                  <span>for you</span>
                  <strong>♡</strong>
                </div>

                <div className="bb-envelope-front" />
              </div>

              <div className="bb-envelope-sticker">
                ♥
              </div>

            </div>

            <button
              className="bb-open-button"
              onClick={() => setStarted(true)}
            >
              Open your little surprise
              <span>→</span>
            </button>

            <p className="bb-scroll-hint">
              take your time · there is no rush
            </p>
          </div>
        </section>
      )}

      {started && (
        <>

          {/* ================================================================
              NAV
          ================================================================= */}

          <nav className="bb-nav">
            <div className="bb-nav-name">
              {HER_NAME}
              <span>♡</span>
            </div>

            <div className="bb-nav-links">
              <a href="#story">our story</a>
              <a href="#letter">a letter</a>
              <a href="#ending">♡</a>
            </div>
          </nav>


          {/* ================================================================
              HERO
          ================================================================= */}

          <ScrollReveal>
            <section className="bb-hero">

              <div className="bb-hero-content">

                <p className="bb-eyebrow">
                  ✦ HAPPY BIRTHDAY, {HER_NAME.toUpperCase()} ✦
                </p>

                <h2>
                  Today is about
                  <br />
                  <em>you.</em>
                </h2>

                <div className="bb-hero-divider">
                  <span>♡</span>
                </div>

                <p className="bb-hero-submessage">
                  And there's something else I've been meaning to tell you.
                </p>

                <a href="#story" className="bb-down-arrow">
                  ↓
                </a>
              </div>

            </section>
          </ScrollReveal>


          {/* ================================================================
              LITTLE NOTE
          ================================================================= */}

          <ScrollReveal>
            <section className="bb-note-section">

              <div className="bb-paper-note" style={{ width: 'min(900px, 80vw)', padding: '50px 30px', minHeight: 'auto' }}>
                <span className="bb-note-tape" />

                <p className="bb-handwritten">
                  {flowerLine1}
                </p>

                <p className="bb-note-small">
                  {flowerLine2}
                </p>

                {/* Combined Wishes Grid for Vault inside the Note */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', width: '100%', marginTop: '50px' }}>

                  {/* this wish should be like text wish envelope in the normal wish page  */}
                  <div className="wish-wall-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {dynamic.personalMessage && [
                      {
                        id: "vault-personal",
                        content: dynamic.personalMessage,
                      }
                    ].map((wish, idx) => (
                      <WishCard
                        key={wish.id}
                        wish={wish}
                        index={idx}
                        onClick={setSelectedWish}
                      />
                    ))}
                  </div>

                  {/* Video Wish from Dynamic Data */}
                  {dynamic.videoWish && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <video src={dynamic.videoWish} controls style={{ width: "100%", maxWidth: "250px", borderRadius: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }} />
                    </div>
                  )}

                </div>
              </div>

            </section>
          </ScrollReveal>

          <AnimatePresence>
            {selectedWish && (
              <WishModal
                wish={selectedWish}
                onClose={() => setSelectedWish(null)}
              />
            )}
          </AnimatePresence>



          {/* ================================================================
              TIMELINE
          ================================================================= */}

          <ScrollReveal>
            <section className="bb-timeline-section">

              <div className="bb-timeline-top">

                <div>
                  <span className="bb-section-kicker" style={{ fontWeight: "bold" }}>
                    OUR LITTLE ARCHIVE
                  </span>

                  <h2>
                    Moments I
                    <em>keep.</em>
                  </h2>
                </div>

                <div className="bb-timeline-controls">

                  <button
                    onClick={() => scrollTimeline("prev")}
                    aria-label="Previous memory"
                  >
                    ←
                  </button>

                  <button
                    onClick={() => scrollTimeline("next")}
                    aria-label="Next memory"
                  >
                    →
                  </button>

                </div>

              </div>


              <div
                ref={timelineRef}
                className="bb-timeline"
              >

                {timeline.map((memory, index) => (

                  <article
                    className={`bb-memory-card ${index % 2 === 0
                      ? "bb-card-up"
                      : "bb-card-down"
                      }`}
                    key={index}
                    onClick={() => setActiveMemory(memory)}
                  >

                    <div className="bb-memory-pin">
                      ♥
                    </div>

                    <div className="bb-memory-photo">

                      <img
                        src={memory.image}
                        alt={memory.title}
                      />

                      <div className="bb-photo-overlay">
                        <span>view memory</span>
                      </div>

                    </div>

                    <div className="bb-memory-content">

                      <div className="bb-memory-date">
                        {memory.date && memory.date !== "Unknown" ? `${memory.date} ` : ""}
                        <span>{memory.year !== "Unknown" ? memory.year : ""}</span>
                      </div>

                      <h3>
                        {memory.title}
                      </h3>

                      <p>
                        {memory.description}
                      </p>

                    </div>

                  </article>

                ))}

                <div className="bb-timeline-end">
                  <span>♡</span>
                  <p>and many more to come...</p>
                </div>

              </div>


              <div className="bb-timeline-scroll-label">
                <span>←</span>
                swipe / scroll
                <span>→</span>
              </div>

            </section>
          </ScrollReveal>


          {/* ================================================================
              THINGS I LIKE
          ================================================================= */}

          <ScrollReveal>
            <section className="bb-things-section">

              <div className="bb-section-number" style={{ fontWeight: "bold" }}>
                THINGS I NEVER SAY ENOUGH
              </div>

              <div className="bb-things-header">

                <h2>
                  Little things
                  <br />
                  <em>about you.</em>
                </h2>


              </div>


              <div className="bb-heart-grid">

                {littleThings.map((thing, index) => (

                  <button
                    className={`bb-heart-note ${revealedThings.includes(index)
                      ? "revealed"
                      : ""
                      }`}
                    key={index}
                    onClick={() => revealThing(index)}
                  >

                    {!revealedThings.includes(index) ? (
                      <>
                        <span className="bb-heart-symbol">
                          ♥
                        </span>

                        <small>
                          tap me
                        </small>
                      </>
                    ) : (
                      <>
                        <span className="bb-revealed-number">
                          0{index + 1}
                        </span>

                        <p>
                          {thing}
                        </p>
                      </>
                    )}

                  </button>

                ))}

              </div>

            </section>
          </ScrollReveal>


          {/* ================================================================
              SCRAPBOOK GALLERY
          ================================================================= */}

          <ScrollReveal>
            <section className="bb-scrapbook">

              <div className="bb-scrapbook-title">

                <span className="bb-section-kicker">
                  THE PHOTO ALBUM
                </span>

                <h2>
                  Proof that
                  <br />
                  <em>we were here.</em>
                </h2>

              </div>

              <div className="bb-scrapbook-board">
                {photos[0] && (
                  <div className="bb-polaroid bb-polaroid-one">
                    <img src={photos[0]} alt="" />
                    <span>one of my favourites</span>
                  </div>
                )}

                {photos[1] && (
                  <div className="bb-polaroid bb-polaroid-two">
                    <img src={photos[1]} alt="" />
                    <span>you + me</span>
                  </div>
                )}

                {photos[2] && (
                  <div className="bb-polaroid bb-polaroid-three">
                    <img src={photos[2]} alt="" />
                    <span>remember this?</span>
                  </div>
                )}

                {photos[3] && (
                  <div className="bb-polaroid bb-polaroid-four">
                    <img src={photos[3]} alt="" />
                    <span>♡</span>
                  </div>
                )}

              </div>

            </section>
          </ScrollReveal>


          {/* ================================================================
              LETTER
          ================================================================= */}

          {letterParagraphs.length && (
            <ScrollReveal>
              <section
                id="letter"
                className="bb-letter-section"
              >
                <div className="bb-letter-wrapper">

                  <div className="bb-letter-heading">

                    <span className="bb-section-kicker">
                      SOMETHING FROM ME
                    </span>

                    <h2>
                      A letter
                      <br />
                      <em>for you.</em>
                    </h2>

                  </div>


                  <div className="bb-letter-paper">

                    <div className="bb-letter-top">
                      <span>✦</span>
                      <span>✦</span>
                      <span>✦</span>
                    </div>

                    <div className="bb-letter-body">

                      <p>
                        {letterParagraphs[0]}
                      </p>

                      {!showLetter ? (

                        <button
                          className="bb-reveal-letter"
                          onClick={() => setShowLetter(true)}
                        >
                          <span>Open the rest of my heart</span>
                          <b>♡</b>
                        </button>

                      ) : (

                        <div className="bb-hidden-letter bb-reveal-anim">
                          {letterParagraphs.length > 1 && letterParagraphs.slice(1).map((paragraph, index) => (
                            <p key={index}>
                              {paragraph}
                            </p>
                          ))}
                          <div className="bb-signature">
                            Always,
                            <br />
                            <strong>{YOUR_NAME}</strong>
                          </div>
                        </div>

                      )}

                    </div>

                  </div>

                </div>

              </section>
            </ScrollReveal>
          )}


          {/* ================================================================
              CONFESSION
          ================================================================= */}

          <ScrollReveal>
            <section
              id="ending"
              className="bb-confession-section"
            >

              <div className="bb-confession-content">

                <span className="bb-section-kicker">
                  ONE LAST THING
                </span>

                <div className="bb-confession-stamp">
                  PLEASE READ THIS PART
                </div>



                {(dynamic.confessionText || dynamic.proposalQuestion) && (
                  <>
                    <h2>
                      So...
                    </h2>

                    <p className="bb-confession-main">
                      I've spent all this time
                      <br />
                      talking about
                      <br />
                      <strong>You are Something.</strong>
                    </p>

                    <div className="bb-big-heart">
                      ♥
                    </div>

                    <div className="bb-confession-card">

                      <p style={{ whiteSpace: "pre-wrap" }}>
                        {confessionText ? confessionText : "I have to tell you something"}
                      </p>

                      <p className="bb-final-question">
                        {proposalQuestion}
                      </p>

                    </div>


                    {!answer && (

                      <div className="bb-answer-area">

                        <p>
                          You don't have to answer immediately.
                        </p>

                        <div className="bb-answer-buttons" style={{ position: 'relative' }}>

                          <button
                            className="bb-yes-button"
                            onClick={handleYes}
                          >
                            Yes
                            <span>♡</span>
                          </button>

                          <button
                            className="bb-time-button"
                            onClick={handleTime}
                          >
                            I need some time 🤍
                          </button>

                          <button
                            ref={noButtonRef}
                            className="bb-time-button bb-no-runaway"
                            onMouseEnter={handleNoHover}
                            onClick={handleNoHover}
                          >
                            No, I'm sorry
                          </button>

                        </div>

                      </div>

                    )}


                    {answer === "time" && (

                      <div className="bb-time-response">

                        <span>🤍</span>

                        <h3>
                          That's completely okay.
                        </h3>

                        <p>
                          Take all the time you need.
                          <br />
                          Nothing about this changes how much
                          <br />
                          I value you.
                        </p>

                      </div>

                    )}

                    {answer === "hate" && (

                      <div className="bb-time-response">

                        <span>💔</span>

                        <h3>
                          That much you hate me ?!
                        </h3>

                        <p>
                          I guess I tried 100 times to stop you...
                          <br />
                          But I'll respect your choice.
                        </p>

                      </div>

                    )}

                    {showCelebration && (

                      <div className="bb-yes-response">

                        <div className="bb-confetti-hearts">
                          ♥　♡　♥　♡　♥
                        </div>

                        <h3>
                          I know you'll say yes
                        </h3>

                        <p>
                          Happy birthday, {HER_NAME}.
                          <br />
                          Here's to whatever comes next. ♡
                        </p>

                      </div>

                    )}
                  </>
                )}

              </div>

            </section>
          </ScrollReveal>


          {/* ================================================================
              FOOTER
          ================================================================= */}

          <footer className="bb-footer">

            <div className="bb-footer-cat">
            </div>

            <p>
              made with love
            </p>
            <br />

            <div>
              <button
                onClick={() => {
                  if (isOffline && onBack) {
                    onBack();
                  } else if (eventData?.slug) {
                    navigate(`/birthday/${eventData.slug}`, { state: { skipIntro: true } });
                  } else {
                    window.history.back();
                  }
                }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.3s"
                }}
              >
                ← Back to Celebration
              </button>
            </div>

          </footer>


          {/* ================================================================
              MEMORY MODAL
          ================================================================= */}

          {activeMemory && (

            <div
              className="bb-modal"
              onClick={() => setActiveMemory(null)}
            >

              <div
                className="bb-modal-card"
                onClick={(event) => event.stopPropagation()}
              >

                <button
                  className="bb-modal-close"
                  onClick={() => setActiveMemory(null)}
                >
                  ×
                </button>

                <img
                  src={activeMemory.image}
                  alt={activeMemory.title}
                />

                <div className="bb-modal-content">

                  <span>
                    {activeMemory.date && activeMemory.date !== "Unknown" ? `${activeMemory.date} · ` : ""}{activeMemory.year !== "Unknown" ? activeMemory.year : ""}
                  </span>

                  <h3>
                    {activeMemory.title}
                  </h3>

                  <p>
                    {activeMemory.description}
                  </p>

                </div>

              </div>

            </div>

          )}

        </>
      )}
    </main>
  );
}

export default VaultWishes;
