import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

const BookCard = ({ book, onEdit, onDelete, onView, onAddToCart, showAdminButtons }) => {

 const [user, setUser] = useState(() => {
   const storedUser = localStorage.getItem('user');
   return storedUser ? JSON.parse(storedUser) : null;
    });
  const navigate = useNavigate();
  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `http://127.0.0.1:8000/storage/${coverImage}`;
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="book-card">
      <div className="book-cover">
        {book.cover_image ? (
          <img src={getImageUrl(book.cover_image)} alt={book.title} className="cover-image" />
        ) : (
          <div className="cover-placeholder">📚</div>
        )}
        <span className={`availability-badge ${book.status === 'available' ? 'available' : 'unavailable'}`}>
          {book.status}
        </span>
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">المؤلف: {book.author}</p>
        <div className="book-meta">
          <span className="book-category">{book.category}</span>
          <span className="book-price">{book.price} ج.م</span>
        </div>
      </div>
      <div className="book-actions">
        <button className="action-btn view-btn" onClick={() => {
          // navigate(`${book.id}`, { state: book });
          window.location.href = `/books/${book.id}`;

        }}>
          عرض
        </button>
        {isAdmin && showAdminButtons && (
          <>
            <button className="action-btn edit-btn" onClick={onEdit}>
              تعديل
            </button>
            <button className="action-btn delete-btn" onClick={onDelete}>
              حذف
            </button>
          </>
        )}
        {!isAdmin && onAddToCart && (
          <button className="action-btn cart-btn" onClick={onAddToCart}>
            🛒 إضافة للعربة
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
