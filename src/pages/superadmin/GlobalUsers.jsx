import React, { useState, useEffect } from "react";
import { getGlobalMembers, approveMember, rejectMember } from "../../service/adminService";
import { useDialog } from "../../context/DialogContext";
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

export default function GlobalUsers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dialog = useDialog();

  const fetchMembers = async () => {
    try {
      const data = await getGlobalMembers();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleApprove = async (orgId, userId) => {
    try {
      await approveMember(orgId, userId);
      fetchMembers();
    } catch (err) {
      dialog.showAlert(err.message);
    }
  };

  const handleReject = async (orgId, userId) => {
    const reason = await dialog.showPrompt("Enter reason for rejection:");
    if (reason === null) return;
    try {
      await rejectMember(orgId, userId, reason);
      fetchMembers();
    } catch (err) {
      dialog.showAlert(err.message);
    }
  };

  return (
    <div className="admin-section">
      <div className="panel-header">
        <h2>Global Users Management</h2>
      </div>

      <div className="admin-panel">
        <h3>All Platform Users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : members.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Signed Up At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.member_id}>
                    <td data-label="Name">{member.full_name}</td>
                    <td data-label="Email">{member.email}</td>
                    <td data-label="Organization">{member.organization_name}</td>
                    <td data-label="Role"><span className="timeline-category-badge">{member.role}</span></td>
                    <td data-label="Status">
                      <span className={`status-badge ${member.approval_status || 'active'}`}>
                        {member.approval_status || 'active'}
                      </span>
                    </td>
                    <td data-label="Signed Up At">{new Date(member.created_at).toLocaleString()}</td>
                    <td data-label="Actions" className="actions-cell">
                      {member.approval_status === 'pending' ? (
                        <>
                          <button onClick={() => handleApprove(member.organization_id, member.user_id)} className="action-btn success" title="Approve">
                            <HiOutlineCheck />
                          </button>
                          <button onClick={() => handleReject(member.organization_id, member.user_id)} className="action-btn delete" title="Reject">
                            <HiOutlineX />
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem" }}>No action needed</span>
                      )}
                    </td>
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
