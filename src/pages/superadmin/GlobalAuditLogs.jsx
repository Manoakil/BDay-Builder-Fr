import React, { useState, useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { getGlobalAuditLogs } from '../../service/adminService';
import "../../style/Admin.css";

function GlobalAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getGlobalAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">🛡️ Global Audit Logs</h2>
      <p className="admin-section-subtitle">Monitor system-wide administrative actions and security events.</p>

      <div className="admin-actions-bar">
        <div className="admin-search">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Search logs (Coming soon...)" disabled />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Actor (User ID)</th>
              <th>Target (Entity ID)</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>No audit logs found.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td data-label="Timestamp">{new Date(log.created_at).toLocaleString()}</td>
                  <td data-label="Action"><span style={{color: 'var(--admin-primary)', fontWeight: 'bold'}}>{log.action}</span></td>
                  <td data-label="Actor (User ID)" title={log.user_id}>{log.user_id?.substring(0, 8)}...</td>
                  <td data-label="Target (Entity ID)" title={log.entity_id}>{log.entity_type}: {log.entity_id?.substring(0, 8)}...</td>
                  <td data-label="IP Address">{log.ip_address || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GlobalAuditLogs;
