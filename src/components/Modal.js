import React from 'react';


const Modal = ({ 
  isOpen, 
  title, 
  message, 
  children,
  icon,
  onConfirm, 
  onCancel,
  onClose 
}) => {
  if (!isOpen) return null;

  const handleClose = onClose || onCancel;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {icon && <span className="modal-icon">{icon}</span>}
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children || <p className="modal-message">{message}</p>}
        </div>
        {(onConfirm || onCancel) && !children && (
          <div className="modal-footer">
            {onCancel && (
              <button className="modal-btn cancel-btn" onClick={onCancel}>
                إلغاء
              </button>
            )}
            {onConfirm && (
              <button className="modal-btn confirm-btn" onClick={onConfirm}>
                تأكيد
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
