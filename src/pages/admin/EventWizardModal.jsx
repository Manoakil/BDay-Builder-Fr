import React, { useState } from 'react';
import { HiOutlineSparkles, HiOutlineCog, HiOutlineColorSwatch, HiOutlineLockClosed, HiX } from 'react-icons/hi';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

export default function EventWizardModal({ onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const dialog = useDialog();

  // Form State
  const [title, setTitle] = useState("New Surprise Celebration");
  const [eventDate, setEventDate] = useState("");
  const [bdayName, setBdayName] = useState("");
  
  const [autoDeleteDays, setAutoDeleteDays] = useState(30);
  const [allowAnon, setAllowAnon] = useState(false);
  const [moderate, setModerate] = useState(true);
  const [hideWishes, setHideWishes] = useState(true);
  
  const [theme, setTheme] = useState("Elegant");


  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        event_date: eventDate || new Date().toISOString().split('T')[0],
        birthday_person_name: bdayName,
        allow_anonymous_wishes: allowAnon,
        moderate_wishes: moderate,
        wishes_hide_until_birthday: hideWishes,
        theme_settings: { preset: theme },
        created_by: "00000000-0000-0000-0000-000000000000" // Backend overwrites this with actual user ID
      };

      if (autoDeleteDays) {
        const d = new Date();
        d.setDate(d.getDate() + Number(autoDeleteDays));
        payload.expires_at = d.toISOString();
      }

      const vaultPayload = null;


      await onComplete(payload, vaultPayload);
    } catch (err) {
      dialog.showAlert(`Setup failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div className="admin-panel" style={{width: '600px', margin: 0, maxHeight: '90vh', overflowY: 'auto'}}>
        
        <div className="panel-header" style={{display: 'flex', justifyContent: 'space-between'}}>
          <h2>✨ Create Celebration Wizard</h2>
          <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}><HiX /></button>
        </div>

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div>
            <h3 style={{color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <HiOutlineSparkles /> Step 1: Basics
            </h3>
            <p>Let's get the core details of the surprise.</p>
            
            <div className="form-group" style={{marginTop: '1rem'}}>
              <label>Event Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>Event Date</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>Birthday Person Name</label>
              <input type="text" value={bdayName} onChange={e => setBdayName(e.target.value)} placeholder="e.g. Alex" required />
            </div>
          </div>
        )}

        {/* STEP 2: CONFIGURATION */}
        {step === 2 && (
          <div>
            <h3 style={{color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <HiOutlineCog /> Step 2: Configuration
            </h3>
            
            <div className="form-group" style={{marginTop: '1rem'}}>
              <label>Auto-Delete After (Days)</label>
              <input type="number" min="1" value={autoDeleteDays} onChange={e => setAutoDeleteDays(e.target.value)} />
              <small>Platform automatically cleans up the event after these many days.</small>
            </div>
            
            <div className="form-group-toggle" style={{marginTop: '1rem'}}>
              <label>
                <input type="checkbox" checked={allowAnon} onChange={e => setAllowAnon(e.target.checked)} />
                Allow Anonymous Wishes
              </label>
              <small>Guests can post without revealing their identity.</small>
            </div>

            <div className="form-group-toggle">
              <label>
                <input type="checkbox" checked={moderate} onChange={e => setModerate(e.target.checked)} />
                Moderate Wishes
              </label>
              <small>Admins must approve wishes before they appear.</small>
            </div>

            <div className="form-group-toggle">
              <label>
                <input type="checkbox" checked={hideWishes} onChange={e => setHideWishes(e.target.checked)} />
                Hide Wishes Until Birthday
              </label>
              <small>Wishes remain invisible to the birthday person until reveal time.</small>
            </div>
          </div>
        )}

        {/* STEP 3: THEME */}
        {step === 3 && (
          <div>
            <h3 style={{color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <HiOutlineColorSwatch /> Step 3: Theme Selection
            </h3>
            <p>Select a visual aesthetic for the celebration page.</p>

            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              {['Elegant', 'Party', 'Dark Mode'].map(t => (
                <div 
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    flex: 1, padding: '1rem', border: `2px solid ${theme === t ? 'var(--admin-primary)' : '#ddd'}`,
                    borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: theme === t ? 'bold' : 'normal',
                    background: theme === t ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}



        {/* FOOTER BUTTONS */}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)'}}>
          {step > 1 ? (
            <button className="admin-btn secondary" onClick={handlePrev} disabled={loading}>Back</button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button className="admin-btn primary" onClick={handleNext}>Next Step ➔</button>
          ) : (
            <button className="admin-btn primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Launch Celebration 🚀'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
