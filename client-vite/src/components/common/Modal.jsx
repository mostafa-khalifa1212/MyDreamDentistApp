import React, { useEffect, useRef } from 'react';
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
}, triggerElementRef
) => {
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
  
  const closeButtonRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (show) {
      // Focus on close button when modal opens
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    } else {
      // Return focus to the trigger element when modal closes
      if (triggerElementRef && triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    }
  }, [show, triggerElementRef]);

  // Ensure triggerElementRef is not stale on close
  useEffect(() => {
    return () => {
      if (triggerElementRef && triggerElementRef.current) {
        triggerElementRef.current = null;
      }
    };
  }, []);

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="modalTitle">{title}</h5>
          {closeButton && (
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close"
              onClick={onClose}
              ref={closeButtonRef}
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