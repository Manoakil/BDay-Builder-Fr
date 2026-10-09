import React, { useEffect, useState } from 'react';
import { getMyOrganizations, deleteOrganization, regenerateOrgCode, createOrganization } from '../../service/adminService';
import { HiOutlineTrash, HiOutlineRefresh, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

function OrganizationsManagement() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const dialog = useDialog();
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const orgs = await getMyOrganizations();
      setOrganizations(orgs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orgId) => {
    const confirmed = await dialog.showConfirm("CRITICAL: Are you sure you want to permanently delete this organization? All events, wishes, and users associated will be orphaned or deleted.");
    if (!confirmed) return;
    try {
      await deleteOrganization(orgId);
      setOrganizations(organizations.filter(o => o.id !== orgId));
    } catch (err) {
      dialog.showAlert(`Delete failed: ${err.message}`);
    }
  };

  const handleRegenerate = async (orgId) => {
    const confirmed = await dialog.showConfirm("Are you sure you want to regenerate the invite code? The old code will immediately stop working.");
    if (!confirmed) return;
    try {
      await regenerateOrgCode(orgId);
      // Reload the data in the table with current data from the server
      await fetchOrgs();
      dialog.showAlert('Secret code regenerated successfully!');
    } catch (err) {
      dialog.showAlert(`Regenerate failed: ${err.message}`);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setCreating(true);
    try {
      const payload = {
        name: newOrgName,
        slug: newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      };
      // Only include email if it is not empty
      if (newOrgEmail.trim()) {
        payload.email = newOrgEmail.trim();
        payload.contact_email = newOrgEmail.trim();
      }
      const newOrg = await createOrganization(payload);
      setOrganizations([...organizations, newOrg]);
      setShowCreateModal(false);
      setNewOrgName('');
      setNewOrgEmail('');
    } catch (err) {
      dialog.showAlert(`Create failed: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading organizations...</div>;

  return (
    <div className="admin-section">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h2 className="admin-section-title">🏢 Organizations Management</h2>
          <p className="admin-section-subtitle">Super Admin view to manage all organizations on the platform.</p>
        </div>
        <button className="admin-btn primary" onClick={() => setShowCreateModal(true)}>
          + Create Organization
        </button>
      </div>

      {organizations.length === 0 ? (
        <div className="admin-empty">No organizations found.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Organization Name</th>
                <th>Contact Email</th>
                <th>Invite Code</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(org => (
                <tr key={org.id}>
                  <td data-label="Organization Name">
                    <div className="font-medium"><HiOutlineOfficeBuilding className="inline-icon" /> {org.name}</div>
                  </td>
                  <td data-label="Contact Email">{org.contact_email || "N/A"}</td>
                  <td data-label="Invite Code" className="code-font">{org.secret_code || "Not generated"}</td>
                  <td data-label="Created At">{new Date(org.created_at).toLocaleDateString()}</td>
                  <td data-label="Actions" className="actions-cell">
                    <button onClick={() => handleRegenerate(org.id)} className="action-btn" title="Regenerate Invite Code">
                      <HiOutlineRefresh />
                    </button>
                    <button onClick={() => handleDelete(org.id)} className="action-btn delete" title="Delete Organization">
                      <HiOutlineTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Basic Create Modal */}
      {showCreateModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="admin-panel" style={{width: '400px', margin: 0, padding: '2rem'}}>
            <div className="panel-header">
              <h2>Create Organization</h2>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Organization Name *</label>
                <input type="text" value={newOrgName} onChange={e => setNewOrgName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" value={newOrgEmail} onChange={e => setNewOrgEmail(e.target.value)} />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                <button type="submit" className="admin-btn primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button type="button" className="admin-btn secondary" onClick={() => setShowCreateModal(false)} disabled={creating}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationsManagement;
