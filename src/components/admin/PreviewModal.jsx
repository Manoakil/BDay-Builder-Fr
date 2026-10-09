import React from 'react';
import { HiOutlineX } from 'react-icons/hi';
import './PreviewModal.css';

export default function PreviewModal({ isOpen, onClose, content, mediaUrl, type }) {
  if (!isOpen) return null;

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
        <button className="preview-modal-close" onClick={onClose} title="Close Preview">
          <HiOutlineX />
        </button>
        
        <div className="preview-media-container">
          {mediaUrl && (
            type === 'video' ? (
              <video src={mediaUrl} controls autoPlay className="preview-media" />
            ) : (
              <img src={mediaUrl} alt="Preview" className="preview-media" />
            )
          )}
        </div>
        
        {content && (
          <div className="preview-text-content">
            <p>{content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
