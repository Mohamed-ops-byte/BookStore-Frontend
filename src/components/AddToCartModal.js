import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Actions/cartAction';
import { closeModal } from '../Redux/Actions/modalAction';


const AddToCartModal = ({ isOpen, book, onClose }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen || !book) return null;

  const getImageUrl = (coverImage) => {
    if (!coverImage) return '/placeholder-book.png';
    if (coverImage.startsWith('http')) return coverImage;
    return `http://127.0.0.1:8000/storage/${coverImage}`;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    const result = await dispatch(addToCart(book, quantity));
    
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 1500);
    }
    
    setIsAdding(false);
  };

  const handleClose = () => {
    setQuantity(1);
    setShowSuccess(false);
    if (onClose) {
      onClose();
    } else {
      dispatch(closeModal());
    }
  };

  const totalPrice = (parseFloat(book.price) || 0) * quantity;

  return (
    <div className="add-to-cart-overlay" onClick={handleClose}>
      <div className="add-to-cart-container" onClick={(e) => e.stopPropagation()}>
        {showSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>تمت الإضافة بنجاح!</h3>
            <p>تم إضافة الكتاب إلى سلة المشتريات</p>
          </div>
        ) : (
          <>
            <div className="add-to-cart-header">
              <h3>إضافة إلى السلة</h3>
              <button className="close-btn" onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className="add-to-cart-body">
              <div className="book-preview">
                <img 
                  src={getImageUrl(book.cover_image)} 
                  alt={book.title}
                  className="book-preview-image"
                />
                <div className="book-preview-info">
                  <h4 className="book-preview-title">{book.title}</h4>
                  <p className="book-preview-author">
                    <span className="label">المؤلف:</span> {book.author}
                  </p>
                  {book.category && (
                    <p className="book-preview-category">
                      <span className="label">التصنيف:</span> {book.category}
                    </p>
                  )}
                  <p className="book-preview-price">
                    {book.price} جنيه
                  </p>
                </div>
              </div>

              <div className="quantity-section">
                <label className="quantity-label">الكمية:</label>
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= 99) setQuantity(val);
                    }}
                    min="1"
                    max="99"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="total-section">
                <div className="total-row">
                  <span>السعر للوحدة:</span>
                  <span className="total-value">{book.price} جنيه</span>
                </div>
                <div className="total-row">
                  <span>الكمية:</span>
                  <span className="total-value">{quantity}</span>
                </div>
                <div className="total-row final-total">
                  <span>الإجمالي:</span>
                  <span className="total-value">{totalPrice.toFixed(2)} جنيه</span>
                </div>
              </div>
            </div>

            <div className="add-to-cart-footer">
              <button 
                className="cancel-btn" 
                onClick={handleClose}
                disabled={isAdding}
              >
                إلغاء
              </button>
              <button 
                className="add-btn" 
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <span className="spinner"></span>
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    🛒 إضافة إلى السلة
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddToCartModal;
