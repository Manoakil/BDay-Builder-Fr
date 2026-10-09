import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, getAuthHeaders } from '../../service/authService';
import './DownloadModal.css';

export default function DownloadModal({ isOpen, onClose, eventId, stats }) {
  const [step, setStep] = useState('prompt'); // prompt, generating, success
  const [progressIndex, setProgressIndex] = useState(0);

  const progressSteps = [
    "Gathering your wishes...",
    "Preparing memories...",
    "Collecting photos...",
    "Packaging videos...",
    "Building your celebration...",
    "Almost there..."
  ];

  // Rotate progress messages when generating
  useEffect(() => {
    let interval;
    if (step === 'generating') {
      interval = setInterval(() => {
        setProgressIndex((prev) => Math.min(prev + 1, progressSteps.length - 1));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleDownload = async () => {
    setStep('generating');
    setProgressIndex(0);
    
    try {
      // Create a URL and force download
      const response = await fetch(`${API_BASE_URL}/offline-celebration/${eventId}/offline-package`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate package");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // The filename can be extracted from content-disposition header if needed,
      // but we can just use a fallback
      link.setAttribute('download', `offline-celebration.zip`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
      setStep('success');
    } catch (error) {
      console.error("Failed to generate offline package:", error);
      alert("Some parts of your celebration couldn't be prepared. Please try again.");
      setStep('prompt');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="bb-download-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bb-download-modal"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
        >
          {step === 'prompt' && (
            <div className="bb-download-content">
              <h2>Keep This Moment</h2>
              <p className="bb-download-subtitle">Your wishes, memories and little moments are being gathered into one offline experience.</p>
              
              <div className="bb-download-stats">
                <div className="bb-stat-item"><strong>{stats.wishes}</strong> Wishes</div>
                <div className="bb-stat-item"><strong>{stats.memories}</strong> Memories</div>
                <div className="bb-stat-item"><strong>{stats.videos}</strong> Videos</div>
              </div>

              <div className="bb-download-actions">
                <button className="bb-btn-primary" onClick={handleDownload}>
                  Create Offline Celebration
                </button>
                <button className="bb-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="bb-download-content bb-generating">
              <div className="bb-spinner"></div>
              <h3>{progressSteps[progressIndex]}</h3>
              <p>This may take a minute for large videos...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="bb-download-content bb-success">
              <h2>Your celebration is ready ♡</h2>
              <p>The ZIP file has been saved to your device. Extract it and open index.html to view your celebration anywhere, without internet.</p><br/>
              <button className="bb-btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
