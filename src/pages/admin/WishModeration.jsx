import React, { useEffect, useState } from 'react';
import { getWishesForEvent, approveWish, adminDeleteWish } from '../../service/eventService';
import { getMyBirthdayEvent } from '../../service/eventService';
import { HiOutlineCheck, HiOutlineTrash, HiOutlinePlay, HiOutlinePhotograph, HiOutlineChatAlt2, HiOutlineEye } from 'react-icons/hi';
import PreviewModal from '../../components/admin/PreviewModal';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

function WishModeration() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const dialog = useDialog();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const evt = await getMyBirthdayEvent();
      setEvent(evt);
      if (evt) {
        const data = await getWishesForEvent(evt.id);
        setWishes(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (wishId) => {
    try {
      await approveWish(wishId);
      setWishes(wishes.map(w => w.id === wishId ? { ...w, status: 'approved' } : w));
    } catch (err) {
      dialog.showAlert(`Failed to approve: ${err.message}`);
    }
  };

  const handleDelete = async (wishId) => {
    const confirmed = await dialog.showConfirm("Are you sure you want to permanently delete this wish?");
    if (!confirmed) return;
    try {
      await adminDeleteWish(wishId);
      setWishes(wishes.filter(w => w.id !== wishId));
    } catch (err) {
      dialog.showAlert(`Failed to delete: ${err.message}`);
    }
  };

  if (loading) return <div className="admin-loading">Loading wishes...</div>;
  if (!event) return <div className="admin-empty">No active birthday event found.</div>;

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">💌 Wish Moderation</h2>
      <p className="admin-section-subtitle">Review, approve, or remove wishes before they appear on the celebration wall.</p>

      {wishes.length === 0 ? (
        <div className="admin-empty">No wishes have been submitted yet.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Wisher</th>
                <th>Content Preview</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishes.map(wish => (
                <tr key={wish.id} className={wish.status === 'pending' ? 'row-pending' : ''}>
                  <td data-label="Type">
                    <span className="wish-type-badge">
                      {wish.wish_type === 'text' || wish.wish_type === 'emoji' ? <HiOutlineChatAlt2 /> : null}
                      {wish.wish_type === 'image' ? <HiOutlinePhotograph /> : null}
                      {wish.wish_type === 'video' || wish.wish_type === 'voice' ? <HiOutlinePlay /> : null}
                      {' ' + wish.wish_type}
                    </span>
                  </td>
                  <td data-label="Wisher">{wish.guest_name || wish.wisher_name || "Anonymous"}</td>
                  <td data-label="Content Preview" className="truncate-cell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button 
                      onClick={() => setPreviewData({ content: wish.content, mediaUrl: wish.media_url, type: wish.wish_type })} 
                      className="action-btn" 
                      title="View Content"
                      style={{ color: 'var(--admin-secondary)', borderColor: 'var(--admin-secondary)' }}
                    >
                      <HiOutlineEye />
                    </button>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${wish.status}`}>
                      {wish.status}
                    </span>
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    {wish.status !== 'approved' && (
                      <button onClick={() => handleApprove(wish.id)} className="action-btn approve" title="Approve">
                        <HiOutlineCheck />
                      </button>
                    )}
                    <button onClick={() => handleDelete(wish.id)} className="action-btn delete" title="Delete">
                      <HiOutlineTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PreviewModal 
        isOpen={!!previewData} 
        onClose={() => setPreviewData(null)} 
        content={previewData?.content} 
        mediaUrl={previewData?.mediaUrl} 
        type={previewData?.type} 
      />
    </div>
  );
}

export default WishModeration;
