import React, { useState, useEffect } from 'react';
import { getMyOrganizations, getOrgMetrics } from '../../service/adminService';
import { HiOutlineUserGroup, HiOutlineMail, HiOutlineChatAlt2, HiOutlineLockClosed } from 'react-icons/hi';
import "../../style/Admin.css";

export default function OrgAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgs = await getMyOrganizations();
        if (orgs && orgs.length > 0) {
          const orgId = orgs[0].id;
          const data = await getOrgMetrics(orgId);
          setMetrics(data);
        } else {
          setError("No organization found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-loading">Loading analytics...</div>;
  if (error) return <div className="admin-empty" style={{color: 'var(--admin-danger)'}}>{error}</div>;
  if (!metrics) return <div className="admin-empty">No analytics data available.</div>;

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">📊 Analytics & Reports</h2>
      <p className="admin-section-subtitle">Real-time insights into your organization's celebration engagement.</p>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))', color: 'var(--admin-success)', boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.3)' }}>
            <HiOutlineUserGroup />
          </div>
          <div className="metric-info">
            <h3>Total Users</h3>
            <p>{metrics.total_users}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))', color: '#f59e0b', boxShadow: 'inset 0 0 0 1px rgba(245, 158, 11, 0.3)' }}>
            <HiOutlineMail />
          </div>
          <div className="metric-info">
            <h3>Pending Invites</h3>
            <p>{metrics.pending_users}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))', color: '#3b82f6', boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.3)' }}>
            <HiOutlineChatAlt2 />
          </div>
          <div className="metric-info">
            <h3>Total Wishes</h3>
            <p>{metrics.total_wishes}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(244, 63, 94, 0.15))', color: '#ec4899', boxShadow: 'inset 0 0 0 1px rgba(236, 72, 153, 0.3)' }}>
            <HiOutlineChatAlt2 />
          </div>
          <div className="metric-info">
            <h3>Pending Wishes</h3>
            <p>{metrics.pending_wishes}</p>
          </div>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: '2rem' }}>
        <div className="panel-header">
          <h2>Engagement Details</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
          <div style={{ padding: '1rem', background: 'var(--admin-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlineLockClosed style={{ fontSize: '1.5rem', color: metrics.vault_enabled ? 'var(--admin-success)' : 'var(--admin-text-muted)' }} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Secret Vault Status</h3>
            <p style={{ margin: 0, color: 'var(--admin-text-light)' }}>
              {metrics.vault_enabled 
                ? "The secret vault is currently ENABLED. Wishers can solve the clue to view hidden vault messages." 
                : "The secret vault is currently DISABLED. Set up a question and hint to enable it."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
