import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from '../Redux/Actions/cartAction';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const summary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
      0
    );
    const discountAmount = Math.round(subtotal * discountPercent);
    const netSubtotal = subtotal - discountAmount;
    const shipping = netSubtotal > 0 ? (netSubtotal >= 500 ? 0 : 50) : 0;
    const tax = Math.round(netSubtotal * 0.1);
    const total = netSubtotal + shipping + tax;
    return { subtotal, discountAmount, shipping, tax, total };
  }, [items, discountPercent]);

  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `http://127.0.0.1:8000/storage/${coverImage}`;
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartQuantity(id, quantity));
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm('هل تريد مسح كل محتويات السلة؟')) {
      dispatch(clearCart());
    }
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) {
      setCouponMessage('أدخل كود الخصم أولاً');
      return;
    }

    if (code === 'BOOK10') {
      setDiscountPercent(0.1);
      setCouponMessage('تم تطبيق خصم 10%');
    } else {
      setDiscountPercent(0);
      setCouponMessage('الكود غير صالح');
    }
  };

  const handleProceedToCheckout = () => {
    if (!items.length) return;
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate('/books')}>
          ← العودة للكتب
        </button>
        <div>
          <h1>🛒 سلة التسوق</h1>
          <p className="subtitle">{items.length} كتب في سلتك</p>
        </div>
      </header>

      <div className="cart-layout">
        <main className="cart-main">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">📭</div>
              <h2>سلتك فارغة</h2>
              <p>لم تضف أي كتب إلى سلتك بعد</p>
              <button className="cta-btn" onClick={() => navigate('/books')}>
                تصفح الكتب
              </button>
            </div>
          ) : (
            <>
              <section className="cart-items">
                <h3 className="section-title">المنتجات</h3>
                <div className="items-list">
                  {items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        {item.cover_image ? (
                          <img
                            src={getImageUrl(item.cover_image)}
                            alt={item.title}
                            className="item-cover"
                          />
                        ) : (
                          <span className="item-placeholder">📚</span>
                        )}
                      </div>
                      <div className="item-details">
                        <h4 className="item-title">{item.title}</h4>
                        <p className="item-author">{item.author}</p>
                        <p className="item-price">
                          {(parseFloat(item.price) || 0).toLocaleString('ar-EG')} ج.م
                        </p>
                      </div>
                      <div className="item-quantity">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
                          }
                          min="1"
                        />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-total">
                        <p>
                          {(
                            (parseFloat(item.price) || 0) * item.quantity
                          ).toLocaleString('ar-EG')}{' '}
                          ج.م
                        </p>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)} title="حذف">
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cart-coupon">
                <h3 className="section-title">كود الخصم</h3>
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="أدخل كود الخصم (BOOK10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button className="apply-btn" onClick={handleApplyCoupon}>
                    تطبيق
                  </button>
                </div>
                {couponMessage && <p className="coupon-message">{couponMessage}</p>}
              </section>
            </>
          )}
        </main>

        {items.length > 0 && (
          <aside className="cart-sidebar">
            <section className="order-summary">
              <h3>ملخص الطلب</h3>
              <div className="summary-row">
                <span>السعر الأساسي</span>
                <span>{summary.subtotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
              {summary.discountAmount > 0 && (
                <div className="summary-row saving-row">
                  <span>الخصم</span>
                  <span className="free">-{summary.discountAmount.toLocaleString('ar-EG')} ج.م</span>
                </div>
              )}
              <div className="summary-row">
                <span>الشحن</span>
                <span className={summary.shipping === 0 ? 'free' : ''}>
                  {summary.shipping === 0 ? 'مجاني' : summary.shipping + ' ج.م'}
                </span>
              </div>
              <div className="summary-row">
                <span>الضريبة</span>
                <span>{summary.tax.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>الإجمالي</span>
                <span>{summary.total.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <button className="checkout-btn" onClick={handleProceedToCheckout}>
                متابعة الدفع
              </button>
              <button className="continue-shopping-btn" onClick={() => navigate('/books')}>
                استكمال التسوق
              </button>
              <button className="clear-cart-btn" onClick={handleClearCart}>
                مسح السلة
              </button>
            </section>

            <section className="shipping-info">
              <h4>معلومات الشحن</h4>
              <div className="info-item">
                <span className="icon">📍</span>
                <div>
                  <p className="label">الشحن المجاني</p>
                  <p className="detail">عند الطلبات فوق 500 ج.م</p>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">⏱️</span>
                <div>
                  <p className="label">وقت الشحن</p>
                  <p className="detail">يومين عمل</p>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">🔒</span>
                <div>
                  <p className="label">الدفع الآمن</p>
                  <p className="detail">ضمان 100% آمن</p>
                </div>
              </div>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;
