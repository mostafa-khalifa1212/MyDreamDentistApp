import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ 
  show, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  closeButton = true,
  staticBackdrop = false
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !staticBackdrop) {
        onClose();
      }
    };
    
    if (show) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose, staticBackdrop]);
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !staticBackdrop) {
      onClose();
    }
  };
  
  if (!show) {
    return null;
  }
  
  // Determine modal size class
  const sizeClass = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }[size] || 'modal-md';
  
  // Create portal to render modal at the end of the body
  return ReactDOM.createPortal(
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
    >
      <div 
        className={`modal-container ${sizeClass}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          {closeButton && (
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close"
              onClick={onClose}
            ></button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;