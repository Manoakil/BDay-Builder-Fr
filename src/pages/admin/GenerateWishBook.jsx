import React, { useEffect, useState } from 'react';
import { getMyBirthdayEvent, getWishesForEvent } from '../../service/eventService';
import { HiOutlinePrinter, HiOutlineBookOpen } from 'react-icons/hi';
import "../../style/Admin.css";

export default function GenerateWishBook() {
  const [event, setEvent] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evt = await getMyBirthdayEvent();
        setEvent(evt);
        if (evt) {
          const allWishes = await getWishesForEvent(evt.id);
          // Only include approved wishes
          setWishes((allWishes || []).filter(w => w.status === 'approved'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="admin-loading">Generating Wish Book...</div>;
  if (!event) return <div className="admin-empty">No active birthday event found.</div>;

  return (
    <div className="admin-section">
      {/* Hide controls when printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .wish-book-print-area, .wish-book-print-area * {
            visibility: visible;
          }
          .wish-book-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .wish-card {
            page-break-inside: avoid;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            margin-bottom: 2rem !important;
            background: white !important;
            color: black !important;
          }
          .print-hidden {
            display: none !important;
          }
          @page {
            margin: 2cm;
          }
        }
        
        .wish-book-preview {
          background: #ffffff;
          color: #1e293b !important;
          border-radius: 12px;
          padding: 3rem;
          margin-top: 2rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .book-cover {
          text-align: center;
          padding: 4rem 2rem;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 3rem;
        }
        
        .book-title {
          font-size: 3rem;
          font-weight: 700;
          color: #0f172a !important;
          margin-bottom: 1rem;
        }
        
        .book-subtitle {
          font-size: 1.25rem;
          color: #64748b !important;
        }
        
        .wish-masonry {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .wish-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          break-inside: avoid;
        }
        
        .wish-author {
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: #334155 !important;
        }
        
        .wish-content-text {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #0f172a !important;
          font-style: italic;
        }
        
        .wish-image {
          max-width: 100%;
          border-radius: 8px;
          margin-top: 1rem;
        }
      `}</style>

      <div className="print-hidden" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="admin-section-title">📖 Digital Wish Book</h2>
          <p className="admin-section-subtitle">A compilation of all approved wishes. Ready to be printed or saved as a PDF keepsake.</p>
        </div>
        <button className="admin-btn primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HiOutlinePrinter style={{ fontSize: '1.2rem' }} /> Print / Save as PDF
        </button>
      </div>

      {wishes.length === 0 ? (
        <div className="admin-empty print-hidden" style={{ marginTop: '2rem' }}>
          <HiOutlineBookOpen style={{ fontSize: '3rem', color: '#cbd5e1', margin: '0 auto 1rem auto' }} />
          <p>No approved wishes found to generate a book.</p>
        </div>
      ) : (
        <div className="wish-book-preview wish-book-print-area">
          <div className="book-cover">
            {event.birthday_person_photo && (
              <img 
                src={event.birthday_person_photo} 
                alt={event.birthday_person_name} 
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 2rem auto', display: 'block' }} 
              />
            )}
            <h1 className="book-title">
              {event.birthday_person_name ? `${event.birthday_person_name}'s Birthday` : event.title}
            </h1>
            <p className="book-subtitle">A collection of wishes and memories from your loved ones.</p>
            <p style={{ marginTop: '2rem', color: '#94a3b8' }}>
              {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="wish-masonry">
            {wishes.map((wish, idx) => (
              <div key={wish.id || idx} className="wish-card">
                <div className="wish-author">From: {wish.guest_name || wish.wisher_name || "Anonymous"}</div>
                
                {wish.content && (
                  <p className="wish-content-text">"{wish.content}"</p>
                )}
                
                {wish.wish_type === 'image' && wish.media_url && (
                  <img src={wish.media_url} alt="Memory" className="wish-image" />
                )}
                
                {(wish.wish_type === 'video' || wish.wish_type === 'voice') && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                      [ Includes a {wish.wish_type} message available in the digital portal ]
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            Generated with love on {new Date().toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}
