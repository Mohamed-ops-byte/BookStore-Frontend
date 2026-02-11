import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBooksByCategory } from '../Redux/Actions/BookAction';
import { addToCart, getCartItems } from '../Redux/Actions/cartAction';
import { openCartModal } from '../Redux/Actions/modalAction';
import { toast } from 'react-toastify';

const CategoryBooks = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState({});

  // الحصول على البيانات من Redux store
  const categoryBooks = useSelector(state => state.allBooks?.categoryBooks) || [];
  const loading = useSelector(state => state.allBooks?.loading);
  const { totalItems } = useSelector(state => state.cart);

  useEffect(() => {
    if (category) {
      dispatch(getBooksByCategory(category));
    }
  }, [dispatch, category]);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `http://127.0.0.1:8000/storage/${coverImage}`;
  };

  const handleQuantityChange = (bookId, change) => {
    setQuantity(prev => ({
      ...prev,
      [bookId]: Math.max(1, (prev[bookId] || 1) + change)
    }));
  };

  const handleAddToCart = async (book) => {
    const qty = quantity[book.id] || 1;
    await dispatch(addToCart(book, qty));
    await dispatch(getCartItems());
    toast.success('تم إضافة الكتاب إلى السلة');
  };

  const handleOpenCart = () => {
    dispatch(getCartItems());
    dispatch(openCartModal());
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="category-books-container">
      <button className="floating-cart-btn" onClick={handleOpenCart}>
        🛒
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">الرئيسية</Link>
        <span className="separator">›</span>
        <Link to="/books">الكتب</Link>
        <span className="separator">›</span>
        <span className="current">{category}</span>
      </div>

      {/* Page Header */}
      <div className="category-header">
        <h1>كتب {category}</h1>
        <p className="category-count">عدد الكتب: {categoryBooks.length}</p>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
          جاري التحميل...
        </div>
      ) : categoryBooks.length === 0 ? (
        <div className="no-books" style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          لا توجد كتب في هذه الفئة
        </div>
      ) : (
        <div className="books-grid">
          {categoryBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-card-image">
                {book.cover_image ? (
                  <img src={getImageUrl(book.cover_image)} alt={book.title} />
                ) : (
                  <div className="image-placeholder">📚</div>
                )}
                {book.discount > 0 && (
                  <span className="discount-badge">-{book.discount}%</span>
                )}
              </div>

              <div className="book-card-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>

                <div className="rating">
                  <div className="stars">
                    {renderStars(Math.round(book.rating))}
                  </div>
                  <span className="rating-number">({book.reviewsCount})</span>
                </div>

                <div className="book-price">
                  {book.discount > 0 && (
                    <span className="original-price">{book.originalPrice} ج.م</span>
                  )}
                  <span className="current-price">{book.price} ج.م</span>
                </div>

                <div className="book-availability">
                  <span className={`status ${book.availability === 'متوفر' ? 'available' : 'unavailable'}`}>
                    {book.availability === 'متوفر' ? '✓' : '✕'} {book.availability}
                  </span>
                </div>

                <div className="book-actions">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(book.id, -1)}
                      disabled={(quantity[book.id] || 1) <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      value={quantity[book.id] || 1}
                      readOnly
                    />
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(book.id, 1)}
                      disabled={(quantity[book.id] || 1) >= book.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(book)}
                    disabled={book.availability !== 'متوفر'}
                  >
                    🛒 إضافة
                  </button>
                </div>

                <Link
                  to={`/books/${book.id}`}
                  className="btn-view-details"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .category-books-container {
          padding: 20px;
          margin-top: 20px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
          flex-direction: row-reverse;
        }

        .breadcrumb a {
          color: #3498db;
          text-decoration: none;
          cursor: pointer;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .breadcrumb .separator {
          color: #999;
        }

        .breadcrumb .current {
          color: #333;
          font-weight: bold;
        }

        .category-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .category-header h1 {
          font-size: 32px;
          color: #333;
          margin-bottom: 10px;
        }

        .category-count {
          color: #666;
          font-size: 16px;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .book-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          background: white;
        }

        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .book-card-image {
          position: relative;
          height: 250px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .book-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          background: #f0f0f0;
        }

        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #e74c3c;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }

        .book-card-content {
          padding: 15px;
        }

        .book-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
          min-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .book-author {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 10px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #ddd;
          font-size: 16px;
        }

        .star.filled {
          color: #ffc107;
        }

        .rating-number {
          font-size: 12px;
          color: #999;
        }

        .book-price {
          margin-bottom: 10px;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          margin-right: 10px;
        }

        .current-price {
          font-size: 18px;
          font-weight: bold;
          color: #e74c3c;
        }

        .book-availability {
          margin-bottom: 10px;
        }

        .status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .status.available {
          background: #d4edda;
          color: #155724;
        }

        .status.unavailable {
          background: #f8d7da;
          color: #721c24;
        }

        .book-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          flex: 1;
        }

        .qty-btn {
          background: none;
          border: none;
          padding: 5px 8px;
          cursor: pointer;
          font-size: 14px;
          color: #666;
        }

        .qty-btn:hover:not(:disabled) {
          color: #333;
        }

        .qty-btn:disabled {
          color: #ccc;
          cursor: not-allowed;
        }

        .qty-input {
          border: none;
          width: 30px;
          text-align: center;
          font-size: 14px;
        }

        .btn-add-cart {
          flex: 1;
          background: #3498db;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }

        .btn-add-cart:hover:not(:disabled) {
          background: #2980b9;
        }

        .btn-add-cart:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .btn-view-details {
          display: block;
          text-align: center;
          width: 100%;
          padding: 10px;
          background: #f5f5f5;
          color: #3498db;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
          transition: background 0.3s;
        }

        .btn-view-details:hover {
          background: #e0e0e0;
        }

        .floating-cart-btn {
          position: fixed;
          bottom: 30px;
          left: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          border: none;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 100;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }

        .floating-cart-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e74c3c;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        .no-books {
          text-align: center;
          padding: 50px;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default CategoryBooks;
