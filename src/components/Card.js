import React from 'react';


const Card = ({ title, description, onEdit, onDelete, onView }) => {
  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-actions">
        <button className="action-btn view-btn" onClick={onView}>
          <span>عرض</span>
        </button>
        <button className="action-btn edit-btn" onClick={onEdit}>
          <span>تعديل</span>
        </button>
        <button className="action-btn delete-btn" onClick={onDelete}>
          <span>حذف</span>
        </button>
      </div>
    </div>
  );
};

export default Card;
