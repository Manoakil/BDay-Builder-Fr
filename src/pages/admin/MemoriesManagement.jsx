import React, { useEffect, useState, useRef } from 'react';
import { getGalleryForEvent, createGalleryItem, deleteGalleryItem, getMyBirthdayEvent } from '../../service/eventService';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';
import { useDialog } from '../../context/DialogContext';
import "../../style/Admin.css";

// Assuming wishService has a generic uploadMedia function
import { uploadMedia } from '../../service/wishService'; 

function MemoriesManagement() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [event, setEvent] = useState(null);
  const dialog = useDialog();
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const evt = await getMyBirthdayEvent();
      setEvent(evt);
      if (evt) {
        const data = await getGalleryForEvent(evt.id);
        setMemories(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !event) return;
    
    setUploading(true);
    try {
      // 1. Upload to storage bucket
      const uploadedFile = await uploadMedia(file, "gallery");
      
      // 2. Create gallery item record
      const newItem = await createGalleryItem({
        event_id: event.id,
        file_id: uploadedFile.id,
        title: file.name
      });
      
      setMemories([newItem, ...memories]);
    } catch (err) {
      dialog.showAlert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (itemId) => {
    const confirmed = await dialog.showConfirm("Delete this memory?");
    if (!confirmed) return;
    try {
      await deleteGalleryItem(itemId);
      setMemories(memories.filter(m => m.id !== itemId));
    } catch (err) {
      dialog.showAlert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) return <div className="admin-loading">Loading memories...</div>;
  if (!event) return <div className="admin-empty">No active birthday event found.</div>;

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">📸 Memories & Albums</h2>
      <p className="admin-section-subtitle">Upload featured photos and videos to showcase on the celebration wall.</p>

      <div className="admin-actions-bar">
        <button 
          className="admin-btn primary" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <HiOutlineUpload /> {uploading ? 'Uploading...' : 'Upload Memory'}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*,video/*" 
          style={{ display: 'none' }} 
        />
      </div>

      {memories.length === 0 ? (
        <div className="admin-empty">No memories uploaded yet. Click "Upload Memory" to start.</div>
      ) : (
        <div className="gallery-grid">
          {memories.map(item => (
            <div key={item.id} className="gallery-item-card">
              <div className="gallery-media-wrapper">
                {item.media_mime_type?.startsWith('video/') ? (
                  <video src={item.media_url} controls className="gallery-media" />
                ) : (
                  <img src={item.media_url} alt={item.title || "Memory"} className="gallery-media" />
                )}
              </div>
              <div className="gallery-item-footer">
                <p className="gallery-caption">{item.title || 'No caption'}</p>
                <button onClick={() => handleDelete(item.id)} className="action-btn delete">
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemoriesManagement;
