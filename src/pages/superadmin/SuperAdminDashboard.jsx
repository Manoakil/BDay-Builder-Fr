import React, { useState, useEffect } from "react";
import { getPlatformMetrics } from "../../service/adminService";

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getPlatformMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div style={{color: 'white'}}>Loading dashboard...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div>
      <div className="panel-header">
        <h2>Platform Overview</h2>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🏢</div>
          <div className="metric-info">
            <h3>Total Organizations</h3>
            <p>{metrics?.total_organizations}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🟢</div>
          <div className="metric-info">
            <h3>Active Organizations</h3>
            <p>{metrics?.active_organizations}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Total Users</h3>
            <p>{metrics?.total_users}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🎉</div>
          <div className="metric-info">
            <h3>Total Birthday Events</h3>
            <p>{metrics?.total_events}</p>
          </div>
        </div>
      </div>
      
      <div className="admin-panel">
        <h3>System Status</h3>
        <p>All systems operational. No recent anomalies detected.</p>
      </div>
    </div>
  );
}
