import React from 'react';

interface PopupModalProps {
  isVisible: boolean;
  onClose: () => void;
}


export function PopupModal({ isVisible, onClose }: PopupModalProps) {
  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <button onClick={onClose}>Close</button>
    </div>
  );
}
