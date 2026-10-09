import React, { useEffect, useState } from 'react';
import { getMyBirthdayEvent, updateEvent, createEvent, createVault } from '../../service/eventService';
import { uploadMedia } from '../../service/wishService';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineSave, HiOutlineUser, HiOutlinePhotograph } from 'react-icons/hi';
import EventWizardModal from './EventWizardModal';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css"; // Reuse existing admin styles

function BirthdayManagement() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dialog = useDialog();
  
  // Wizard State
  const [showWizard, setShowWizard] = useState(false);
  
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [revealTime, setRevealTime] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [timezone, setTimezone] = useState('');
  
  // Birthday Person Details
  const [bdayName, setBdayName] = useState('');
  const [bdayBio, setBdayBio] = useState('');
  const [bdayPhotoUrl, setBdayPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const data = await getMyBirthdayEvent();
      setEvent(data);
      setTitle(data.title || '');
      setEventDate(data.event_date ? data.event_date.split('T')[0] : '');
      setBdayName(data.birthday_person_name || '');
      setBdayBio(data.birthday_person_bio || '');
      setBdayPhotoUrl(data.birthday_person_photo || '');
      
      if (data.reveal_at) {
        // Convert to local datetime-local format string
        const date = new Date(data.reveal_at);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        setRevealTime(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
      } else {
        setRevealTime('');
      }
      
      if (data.expires_at) {
        const date = new Date(data.expires_at);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        setExpiresAt(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
      } else {
        setExpiresAt('');
      }
      
      setTimezone(data.timezone || 'UTC');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!event) return;
    setSaving(true);
    try {
      const payload = {
        title: title,
        event_date: eventDate,
        timezone: timezone,
        reveal_at: revealTime ? new Date(revealTime).toISOString() : null,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        birthday_person_name: bdayName,
        birthday_person_bio: bdayBio,
        birthday_person_photo: bdayPhotoUrl
      };
      
      const updated = await updateEvent(event.id, payload);
      dialog.showAlert('Birthday event updated successfully!');
      setEvent(updated);
    } catch (err) {
      dialog.showAlert(`Error updating event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveAndCreateNew = async () => {
    const confirmed = await dialog.showConfirm("Are you sure you want to archive this event? You will not be able to edit it anymore, and a fresh event will be created.");
    if (!confirmed) return;
    
    setSaving(true);
    try {
      // 1. Archive current
      await updateEvent(event.id, { status: 'archived' });
      // 2. We can now prompt the wizard to create a new one, but for simplicity we'll just reload and let the empty state show the wizard.
      dialog.showAlert('Event archived successfully!');
      setEvent(null);
      fetchEvent();
    } catch (err) {
      dialog.showAlert(`Error archiving event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadMedia(file, "gallery");
      setBdayPhotoUrl(uploaded.url);
    } catch (err) {
      dialog.showAlert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const onWizardComplete = async (eventPayload, vaultPayload) => {
    try {
      const { getMyOrganizations } = await import('../../service/adminService');
      const orgs = await getMyOrganizations();
      if (!orgs || orgs.length === 0) throw new Error("No organization found to attach the event to.");
      
      eventPayload.organization_id = orgs[0].id;
      const newEvent = await createEvent(eventPayload);
      
      if (vaultPayload) {
        vaultPayload.event_id = newEvent.id;
        await createVault(vaultPayload);
      }
      
      dialog.showAlert('Celebration launched successfully!');
      setShowWizard(false);
      setEvent(newEvent);
      fetchEvent();
    } catch (err) {
      dialog.showAlert(`Error launching celebration: ${err.message}`);
      throw err;
    }
  };

  if (loading) return <div className="admin-loading">Loading event details...</div>;
  if (!event) return (
    <div className="admin-empty">
      <h3>No Active Celebration</h3>
      <p>There is currently no birthday celebration active for your organization.</p>
      <button className="admin-btn primary" onClick={() => setShowWizard(true)}>
        ✨ Launch New Celebration
      </button>
      
      {showWizard && (
        <EventWizardModal 
          onClose={() => setShowWizard(false)} 
          onComplete={onWizardComplete} 
        />
      )}
    </div>
  );

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">🎂 Birthday Celebration Management</h2>
      <p className="admin-section-subtitle">Configure the core details of the surprise.</p>
      
      <form className="admin-form" onSubmit={handleSave}>
        
        <h3 className="admin-section-subtitle" style={{ color: 'var(--admin-primary)', marginBottom: '1rem', fontWeight: 600 }}>1. Birthday Person Details</h3>
        
        <div className="form-group">
          <label><HiOutlineUser /> Name</label>
          <input 
            type="text" 
            value={bdayName} 
            onChange={e => setBdayName(e.target.value)} 
            placeholder="e.g. Alex Smith" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Short Bio / Tagline</label>
          <input 
            type="text" 
            value={bdayBio} 
            onChange={e => setBdayBio(e.target.value)} 
            placeholder="e.g. Leveling up to 30!" 
          />
        </div>

        <div className="form-group">
          <label><HiOutlinePhotograph /> Profile Photo</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {bdayPhotoUrl && (
              <img src={bdayPhotoUrl} alt="Birthday Person" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--admin-primary)' }} />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
            />
            {uploading && <span className="text-sm text-gray-400">Uploading...</span>}
          </div>
        </div>

        <hr style={{ borderColor: 'var(--admin-border)', margin: '2rem 0' }} />
        <h3 className="admin-section-subtitle" style={{ color: 'var(--admin-secondary)', marginBottom: '1rem', fontWeight: 600 }}>2. Event Configuration</h3>

        <div className="form-group">
          <label>Event Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Alex's Surprise 30th!" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label><HiOutlineCalendar /> Birthday Date</label>
          <input 
            type="date" 
            value={eventDate} 
            onChange={e => setEventDate(e.target.value)} 
            required 
          />
          <small>The actual birth date of the guest of honor.</small>
        </div>
        
        <div className="form-group">
          <label><HiOutlineClock /> Reveal Date & Time</label>
          <input 
            type="datetime-local" 
            value={revealTime} 
            onChange={e => setRevealTime(e.target.value)} 
          />
          <small>When should the portal unlock for the Birthday Person? (Leave blank to unlock on the Birthday Date immediately)</small>
        </div>
        
        <div className="form-group">
          <label><HiOutlineClock /> Auto Delete / Expires At</label>
          <input 
            type="datetime-local" 
            value={expiresAt} 
            onChange={e => setExpiresAt(e.target.value)} 
          />
          <small>Schedule when this celebration page should be permanently deleted (leave blank to keep forever).</small>
        </div>
        
        <div className="form-group">
          <label>Timezone</label>
          <select value={timezone} onChange={e => setTimezone(e.target.value)}>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (US)</option>
            <option value="America/Chicago">Central Time (US)</option>
            <option value="America/Denver">Mountain Time (US)</option>
            <option value="America/Los_Angeles">Pacific Time (US)</option>
            <option value="Europe/London">London (GMT/BST)</option>
            <option value="Europe/Paris">Central Europe (CET)</option>
            <option value="Asia/Kolkata">India (IST)</option>
            <option value="Asia/Tokyo">Japan (JST)</option>
            <option value="Australia/Sydney">Sydney (AEST)</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="admin-btn primary" disabled={saving}>
            <HiOutlineSave /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
          
          <button type="button" onClick={handleArchiveAndCreateNew} className="admin-btn danger" disabled={saving}>
            Archive & Create New Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default BirthdayManagement;
