import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  getCartItems, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart 
} from '../Redux/Actions/cartAction';
import { closeCartModal } from '../Redux/Actions/modalAction';


const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice } = useSelector(state => state.cart);
  const { isCartOpen } = useSelector(state => state.modal);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const getImageUrl = (coverImage) => {
    if (!coverImage) return '/placeholder-book.png';
    if (coverImage.startsWith('http')) return coverImage;
    return `http://127.0.0.1:8000/storage/${coverImage}`;
  };

  const handleRemoveItem = (bookId) => {
    dispatch(removeFromCart(bookId));
  };

  const handleUpdateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartQuantity(bookId, newQuantity));
  };

  const handleClearCart = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع العناصر من السلة؟')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!items.length) return;
    dispatch(closeCartModal());
    navigate('/checkout');
  };

  const handleClose = () => {
    dispatch(closeCartModal());
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay" onClick={handleClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 سلة المشتريات</h2>
          <button className="cart-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="empty-icon">🛒</p>
              <p className="empty-text">السلة فارغة</p>
              <p className="empty-subtext">لم تقم بإضافة أي كتب بعد</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img 
                      src={getImageUrl(item.cover_image)} 
                      alt={item.title}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.title}</h4>
                      <p className="cart-item-author">{item.author}</p>
                      <p className="cart-item-price">{item.price} جنيه</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>عدد الكتب:</span>
                  <span className="summary-value">{totalItems}</span>
                </div>
                <div className="summary-row total-row">
                  <span>الإجمالي:</span>
                  <span className="summary-value">{totalPrice.toFixed(2)} جنيه</span>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <button className="clear-cart-btn" onClick={handleClearCart}>
              مسح السلة
            </button>
            <button className="checkout-btn" onClick={handleCheckout}>
              إتمام الشراء
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
