import React, { useEffect, useState } from 'react';
import { getMyOrganizations } from '../../service/adminService';
import { updateOrganization } from '../../service/eventService';
import { HiOutlineCreditCard, HiOutlineBadgeCheck, HiOutlineStar } from 'react-icons/hi';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

export default function SubscriptionManagement() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const dialog = useDialog();

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const orgs = await getMyOrganizations();
      // Initially, map to ensure we have a fallback for missing values
      const withSubscriptions = (orgs || []).map((org) => ({
        ...org,
        subscription_tier: org.subscription_tier || 'free',
        status: org.status || 'Active'
      }));
      setOrganizations(withSubscriptions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTier = async (orgId, newTier) => {
    const confirmed = await dialog.showConfirm(`Are you sure you want to change this organization's subscription to ${newTier}?`);
    if (!confirmed) return;
    
    // Optimistic UI update
    setOrganizations(organizations.map(org => 
      org.id === orgId ? { ...org, subscription_tier: newTier } : org
    ));
    
    try {
      await updateOrganization(orgId, { subscription_tier: newTier });
      dialog.showAlert('Subscription tier updated successfully!');
    } catch (err) {
      dialog.showAlert(`Failed to update subscription: ${err.message}`);
      // Revert optimistic update on failure by refetching
      fetchOrgs();
    }
  };

  const handleUpdateSettings = async (orgId, currentSettings, key, value) => {
    const newSettings = { ...currentSettings, [key]: value };
    setOrganizations(organizations.map(org => 
      org.id === orgId ? { ...org, settings: newSettings } : org
    ));
    try {
      await updateOrganization(orgId, { settings: newSettings });
      dialog.showAlert(`${key} updated successfully!`);
    } catch (err) {
      dialog.showAlert(`Failed to update setting: ${err.message}`);
      fetchOrgs();
    }
  };

  const getTierBadge = (tier) => {
    const lowerTier = (tier || 'free').toLowerCase();
    switch(lowerTier) {
      case 'enterprise':
        return <span className="status-badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa'}}><HiOutlineStar className="inline-icon" /> Enterprise</span>;
      case 'pro':
      case 'premium':
        return <span className="status-badge" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa'}}><HiOutlineBadgeCheck className="inline-icon" /> Premium</span>;
      default:
        return <span className="status-badge" style={{background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8'}}>Free</span>;
    }
  };

  if (loading) return <div className="admin-loading">Loading subscriptions...</div>;

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">💳 Subscription & Plan Management</h2>
      <p className="admin-section-subtitle">Manage billing tiers and feature access across all organizations.</p>

      {organizations.length === 0 ? (
        <div className="admin-empty">No organizations found.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Current Plan</th>
                <th>Status</th>
                <th>Change Plan</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(org => (
                  <tr key={org.id}>
                    <td data-label="Organization">
                      <div className="font-medium">{org.name}</div>
                      <div className="text-sm text-gray-500">{org.contact_email || 'No email provided'}</div>
                    </td>
                    <td data-label="Current Plan">{getTierBadge(org.subscription_tier)}</td>
                    <td data-label="Status"><span className="status-badge approved">{org.status}</span></td>
                    <td data-label="Change Plan">
                      <select 
                        className="admin-select" 
                        style={{ width: 'auto', padding: '0.4rem 1rem' }}
                        value={org.subscription_tier}
                        onChange={(e) => handleUpdateTier(org.id, e.target.value)}
                      >
                        <option value="free">Free</option>
                        <option value="pro">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </td>
                    <td data-label="Permissions">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <input 
                            type="checkbox" 
                            checked={org.settings?.vault_enabled || false}
                            onChange={(e) => handleUpdateSettings(org.id, org.settings, 'vault_enabled', e.target.checked)}
                          />
                          Vault Access
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <input 
                            type="checkbox" 
                            checked={org.settings?.download_enabled || false}
                            onChange={(e) => handleUpdateSettings(org.id, org.settings, 'download_enabled', e.target.checked)}
                          />
                          Download Access
                        </label>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2.5rem' }}>
        <h3 className="admin-section-subtitle" style={{ color: 'var(--admin-text)' }}>Available Tiers</h3>
        <div className="metrics-grid">
          <div className="metric-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <h3 style={{ color: 'var(--admin-text-light)', marginBottom: '0.5rem' }}>Free Plan</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>$0<span style={{ fontSize: '1rem', color: 'var(--admin-text-light)' }}>/mo</span></p>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
              <li>1 Active Event</li>
              <li>Up to 50 Wishes</li>
              <li>Basic Themes</li>
            </ul>
          </div>
          
          <div className="metric-card" style={{ flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--admin-secondary)' }}>
            <h3 style={{ color: 'var(--admin-secondary)', marginBottom: '0.5rem' }}>Premium</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>$29<span style={{ fontSize: '1rem', color: 'var(--admin-text-light)' }}>/mo</span></p>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
              <li>Unlimited Events</li>
              <li>Unlimited Wishes</li>
              <li>Video Uploads</li>
              <li>Custom Themes</li>
            </ul>
          </div>
          
          <div className="metric-card" style={{ flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--admin-primary)' }}>
            <h3 style={{ color: 'var(--admin-primary)', marginBottom: '0.5rem' }}>Enterprise</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>$99<span style={{ fontSize: '1rem', color: 'var(--admin-text-light)' }}>/mo</span></p>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
              <li>Custom Domain Mapping</li>
              <li>White-labeled Branding</li>
              <li>Dedicated Support</li>
              <li>Export to physical Photobook</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
