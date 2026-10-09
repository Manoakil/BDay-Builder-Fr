import React, { useEffect, useState } from 'react';
import { getPlatformMetrics } from '../../service/adminService';
import { HiOutlineChartBar, HiOutlineUserGroup, HiOutlineGift, HiOutlinePhotograph, HiOutlineOfficeBuilding } from 'react-icons/hi';
import "../../style/Admin.css";

function PlatformAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getPlatformMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading platform analytics...</div>;
  if (!metrics) return <div className="admin-empty">Could not load platform metrics.</div>;

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">📈 Platform Analytics</h2>
      <p className="admin-section-subtitle">Global statistics and usage metrics across all organizations.</p>

      <div className="metrics-grid">
        <div className="metric-card">
          <HiOutlineOfficeBuilding className="metric-icon" />
          <div className="metric-info">
            <span className="metric-value">{metrics.total_organizations || 0}</span>
            <span className="metric-label">Organizations</span>
          </div>
        </div>
        
        <div className="metric-card">
          <HiOutlineUserGroup className="metric-icon" />
          <div className="metric-info">
            <span className="metric-value">{metrics.total_users || 0}</span>
            <span className="metric-label">Total Users</span>
          </div>
        </div>
        
        <div className="metric-card">
          <HiOutlineGift className="metric-icon" />
          <div className="metric-info">
            <span className="metric-value">{metrics.total_wishes || 0}</span>
            <span className="metric-label">Total Wishes</span>
          </div>
        </div>

        <div className="metric-card">
          <HiOutlinePhotograph className="metric-icon" />
          <div className="metric-info">
            <span className="metric-value">{metrics.total_media || 0}</span>
            <span className="metric-label">Media Uploads</span>
          </div>
        </div>
      </div>

      {/* Placeholder for more advanced analytics charts in the future */}
      <div className="admin-empty" style={{ marginTop: '2rem' }}>
        <HiOutlineChartBar style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }} />
        <p>Advanced charting and time-series data will be available in a future update.</p>
      </div>
    </div>
  );
}

export default PlatformAnalytics;
