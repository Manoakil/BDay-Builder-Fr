import React, { useState, useEffect } from "react";
import { getOrganizationMembers, approveMember, rejectMember, getMyOrganizations, removeMember } from "../../service/adminService";
import { HiOutlineCheck, HiOutlineX, HiOutlineUserGroup, HiOutlineTrash } from 'react-icons/hi';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

export default function UsersManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgId, setOrgId] = useState(null);
  const dialog = useDialog();

  const fetchMembers = async (id) => {
    try {
      const data = await getOrganizationMembers(id);
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const orgs = await getMyOrganizations();
        if (orgs && orgs.length > 0) {
          setOrgId(orgs[0].id);
          await fetchMembers(orgs[0].id);
        } else {
          setError("No organization found.");
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await approveMember(orgId, userId);
      fetchMembers(orgId);
    } catch (err) {
      dialog.showAlert(err.message);
    }
  };

  const handleReject = async (userId) => {
    const reason = await dialog.showPrompt("Enter reason for rejection:");
    if (reason === null) return;
    try {
      await rejectMember(orgId, userId, reason);
      fetchMembers(orgId);
    } catch (err) {
      dialog.showAlert(err.message);
    }
  };

  const handleRemove = async (memberId) => {
    const confirmed = await dialog.showConfirm("Are you sure you want to remove this member?");
    if (!confirmed) return;
    try {
      await removeMember(orgId, memberId);
      fetchMembers(orgId);
      dialog.showAlert("Member removed successfully.");
    } catch (err) {
      dialog.showAlert(err.message);
    }
  };

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">👥 Users & Invitations</h2>
      <p className="admin-section-subtitle">Manage organization members, wishers, and their access levels.</p>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading members...</div>
        ) : error ? (
          <div className="admin-empty" style={{ color: "var(--admin-danger)" }}>{error}</div>
        ) : members.length === 0 ? (
          <div className="admin-empty">No members found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td data-label="Name">
                    <div className="font-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HiOutlineUserGroup style={{ color: 'var(--admin-primary)' }} />
                      {member.full_name}
                    </div>
                  </td>
                  <td data-label="Email">{member.email}</td>
                  <td data-label="Role"><span className="timeline-category-badge">{member.role}</span></td>
                  <td data-label="Status">
                    <span className={`status-badge ${member.approval_status}`}>
                      {member.approval_status}
                    </span>
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    {member.approval_status === 'pending' ? (
                      <>
                        <button onClick={() => handleApprove(member.user_id)} className="action-btn success" title="Approve">
                          <HiOutlineCheck />
                        </button>
                        <button onClick={() => handleReject(member.user_id)} className="action-btn delete" title="Reject">
                          <HiOutlineX />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleRemove(member.id)} className="action-btn delete" title="Remove Member">
                        <HiOutlineTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
