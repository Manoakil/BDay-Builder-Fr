import React, { useState, useEffect } from "react";
import { getOrgMetrics, getMyOrganizations, getOrganizationMembers } from "../../service/adminService";
import { getMyBirthdayEvent } from "../../service/eventService";
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineMail } from 'react-icons/hi';
import "../../style/Admin.css";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [org, setOrg] = useState(null);
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orgs = await getMyOrganizations();
        if (orgs && orgs.length > 0) {
          const activeOrg = orgs[0];
          setOrg(activeOrg);
          
          const [metricsData, eventData, usersData] = await Promise.all([
            getOrgMetrics(activeOrg.id).catch(() => null),
            getMyBirthdayEvent().catch(() => null),
            getOrganizationMembers(activeOrg.id).catch(() => [])
          ]);
          
          setMetrics(metricsData);
          setEvent(eventData);
          setUsers(usersData);
        } else {
          setError("No organization found for this admin.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="admin-loading" style={{color: 'white'}}>Loading dashboard...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div>
      <div className="panel-header" style={{marginBottom: '2rem'}}>
        <h2>🏢 Organization Overview: {org?.name}</h2>
      </div>

      {/* ACTIVE EVENT CARD */}
      <div className="admin-panel" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border)'}}>
          <HiOutlineCalendar /> Active Celebration
        </h3>
        {event ? (
          <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <h2 style={{color: 'var(--admin-primary)', margin: 0}}>{event.title}</h2>
            <p style={{margin: 0, color: 'var(--admin-text-light)'}}>Celebrating: <strong>{event.birthday_person_name}</strong> on <strong>{new Date(event.event_date).toLocaleDateString()}</strong></p>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <span className="status-badge active">Status: Active</span>
              {event.expires_at && <span className="status-badge" style={{background: 'var(--admin-secondary)', color: 'white'}}>Auto-Delete: {new Date(event.expires_at).toLocaleDateString()}</span>}
            </div>
          </div>
        ) : (
          <div style={{marginTop: '1rem', color: 'var(--admin-text-light)'}}>
            <p>No active celebration currently running.</p>
            <button className="admin-btn primary" onClick={() => window.location.href = "/admin/birthday"} style={{marginTop: '0.5rem'}}>
              Create New Celebration
            </button>
          </div>
        )}
      </div>
      
      {/* METRICS */}
      <div className="metrics-grid" style={{marginBottom: '2rem'}}>
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Total Users</h3>
            <p>{metrics?.total_users}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-info">
            <h3>Pending Users</h3>
            <p>{metrics?.pending_users}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💌</div>
          <div className="metric-info">
            <h3>Total Wishes</h3>
            <p>{metrics?.total_wishes}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🔐</div>
          <div className="metric-info">
            <h3>Vault Status</h3>
            <p>{metrics?.vault_enabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      {/* USERS DIRECTORY */}
      <div className="admin-panel">
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border)'}}>
          <HiOutlineUserGroup /> Users Directory
        </h3>
        
        {users.length === 0 ? (
          <p style={{marginTop: '1rem', color: 'var(--admin-text-light)'}}>No users found in this organization.</p>
        ) : (
          <div className="admin-table-container" style={{marginTop: '1rem'}}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User / Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td data-label="User / Email">
                      <div className="font-medium" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <HiOutlineMail className="inline-icon" /> 
                        {user.email || user.full_name || (user.user_id ? user.user_id.substring(0, 8) + '...' : 'Unknown')}
                      </div>
                    </td>
                    <td data-label="Role">
                      <span className={`status-badge ${user.role === 'admin' ? 'active' : ''}`} style={{background: user.role === 'admin' ? 'var(--admin-primary)' : '#e2e8f0', color: user.role === 'admin' ? 'white' : 'var(--admin-text)'}}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge ${user.status === 'active' ? 'active' : ''}`} style={{background: user.status === 'active' ? 'var(--admin-success)' : 'var(--admin-secondary)', color: 'white'}}>
                        {(user.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td data-label="Joined At">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  );
}
