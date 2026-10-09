import React, { useEffect, useState } from 'react';
import { getThemeForEvent, updateTheme, getMyBirthdayEvent } from '../../service/eventService';
import { HiOutlineColorSwatch, HiOutlineSparkles, HiOutlineCode } from 'react-icons/hi';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

function ThemeCustomization() {
  const [theme, setTheme] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dialog = useDialog();

  // Form state
  const [primaryColor, setPrimaryColor] = useState('#8b5cf6');
  const [secondaryColor, setSecondaryColor] = useState('#d8b4fe');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [customCss, setCustomCss] = useState('');

  const fontOptions = [
    { label: 'Modern (Inter)', value: "'Inter', sans-serif" },
    { label: 'Elegant (Playfair Display)', value: "'Playfair Display', serif" },
    { label: 'Playful (Comic Sans MS)', value: "'Comic Sans MS', cursive" },
    { label: 'Clean (Roboto)', value: "'Roboto', sans-serif" },
    { label: 'Classic (Georgia)', value: "Georgia, serif" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const evt = await getMyBirthdayEvent();
      setEvent(evt);
      if (evt) {
        const data = await getThemeForEvent(evt.id).catch(() => null);
        if (data) {
          setTheme(data);
          setPrimaryColor(data.primary_color || '#8b5cf6');
          setSecondaryColor(data.secondary_color || '#d8b4fe');
          setFontFamily(data.font_family || "'Inter', sans-serif");
          setCustomCss(data.custom_css || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!theme) return;
    setSaving(true);
    try {
      const payload = {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: fontFamily,
        custom_css: customCss
      };
      const updated = await updateTheme(theme.id, payload);
      dialog.showAlert('Theme updated successfully!');
      setTheme(updated);
    } catch (err) {
      dialog.showAlert(`Error updating theme: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading theme settings...</div>;
  if (!event) return <div className="admin-empty">No active birthday event found.</div>;
  if (!theme) return <div className="admin-empty">Theme configuration not found for this event. (Contact Support)</div>;

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">🎨 Theme Customization</h2>
      <p className="admin-section-subtitle">Personalize the look and feel of the birthday celebration.</p>

      <form className="admin-form" onSubmit={handleSave}>
        
        <div className="form-group-row">
          <div className="form-group flex-1">
            <label><HiOutlineColorSwatch /> Primary Color</label>
            <div className="color-picker-wrapper">
              <input 
                type="color" 
                value={primaryColor} 
                onChange={e => setPrimaryColor(e.target.value)} 
                className="color-input"
              />
              <input 
                type="text" 
                value={primaryColor} 
                onChange={e => setPrimaryColor(e.target.value)} 
                className="color-text-input"
              />
            </div>
            <small>Used for primary buttons, highlights, and main accents.</small>
          </div>
          
          <div className="form-group flex-1">
            <label><HiOutlineColorSwatch /> Secondary Color</label>
            <div className="color-picker-wrapper">
              <input 
                type="color" 
                value={secondaryColor} 
                onChange={e => setSecondaryColor(e.target.value)} 
                className="color-input"
              />
              <input 
                type="text" 
                value={secondaryColor} 
                onChange={e => setSecondaryColor(e.target.value)} 
                className="color-text-input"
              />
            </div>
            <small>Used for backgrounds, subtle gradients, and secondary accents.</small>
          </div>
        </div>

        <div className="form-group">
          <label><HiOutlineSparkles /> Typography (Font Family)</label>
          <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
            {fontOptions.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label><HiOutlineCode /> Custom CSS (Advanced)</label>
          <textarea 
            value={customCss} 
            onChange={e => setCustomCss(e.target.value)} 
            rows={5}
            placeholder="/* Add any custom CSS rules here */"
            className="admin-textarea code-font"
          />
          <small>Only use this if you know what you're doing. It will be injected into the page.</small>
        </div>

        <button type="submit" className="admin-btn primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Theme'}
        </button>
      </form>
    </div>
  );
}

export default ThemeCustomization;
