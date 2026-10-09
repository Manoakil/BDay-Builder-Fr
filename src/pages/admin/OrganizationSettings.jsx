import React, { useEffect, useState } from 'react';
import { getMyOrganizations, regenerateOrgCode } from '../../service/adminService';
import { updateOrganization } from '../../service/eventService';
import { HiOutlineOfficeBuilding, HiOutlineMail, HiOutlineSave } from 'react-icons/hi';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

function OrganizationSettings() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dialog = useDialog();

  // Form State
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orgs = await getMyOrganizations();
      // Assume the admin is managing their primary organization
      if (orgs && orgs.length > 0) {
        const myOrg = orgs[0];
        setOrg(myOrg);
        setName(myOrg.name || '');
        setContactEmail(myOrg.contact_email || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!org) return;
    setSaving(true);
    try {
      const payload = {
        name: name,
        email: contactEmail,
      };
      const updated = await updateOrganization(org.id, payload);
      dialog.showAlert('Organization settings updated successfully!');
      setOrg(updated);
    } catch (err) {
      dialog.showAlert(`Error updating organization: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    const confirmed = await dialog.showConfirm("Are you sure you want to regenerate the invite code? The old code will stop working instantly.");
    if (!confirmed) return;
    try {
      await regenerateOrgCode(org.id);
      await fetchData();
      dialog.showAlert('Secret code regenerated successfully!');
    } catch (err) {
      dialog.showAlert(`Regenerate failed: ${err.message}`);
    }
  };

  if (loading) return <div className="admin-loading">Loading organization settings...</div>;
  if (!org) return <div className="admin-empty">No organization found for your account.</div>;

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">🏢 Organization Settings</h2>
      <p className="admin-section-subtitle">Manage the core details of your organization or family group.</p>

      <form className="admin-form" onSubmit={handleSave}>
        
        <div className="form-group">
          <label><HiOutlineOfficeBuilding /> Organization Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="e.g. The Smith Family"
            required 
          />
          <small>This name is visible to all members you invite.</small>
        </div>

        <div className="form-group">
          <label><HiOutlineMail /> Contact Email</label>
          <input 
            type="email" 
            value={contactEmail} 
            onChange={e => setContactEmail(e.target.value)}
            placeholder="e.g. hello@smithfamily.com"
          />
          <small>Where should important notifications about this organization be sent?</small>
        </div>

        <div className="form-group">
          <label>Invite Code</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="invite-code-display" style={{ margin: 0 }}>
              {org.secret_code || "Not generated"}
            </div>
            <button type="button" onClick={handleRegenerate} className="admin-btn secondary">
              Regenerate Code
            </button>
          </div>
          <small>Share this secret code with members so they can join your organization.</small>
        </div>

        <button type="submit" className="admin-btn primary" disabled={saving}>
          <HiOutlineSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default OrganizationSettings;
