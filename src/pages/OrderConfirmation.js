// src/pages/OrderConfirmation.js

import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../Redux/Actions/cartAction';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const orderData = location.state?.order;
  const paymentData = location.state?.payment;

  useEffect(() => {
    if (!orderData) {
      navigate('/');
      return;
    }

    // Clear cart after successful order
    dispatch(clearCart());
  }, [orderData, navigate, dispatch]);

  if (!orderData) {
    return null;
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="25" fill="none" className="circle"/>
            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark"/>
          </svg>
        </div>

        <h1>تم تأكيد طلبك بنجاح! 🎉</h1>
        <p className="success-message">شكراً لك! تم استلام طلبك وسيتم معالجته قريباً.</p>

        <div className="order-info-card">
          <div className="info-header">
            <h2>معلومات الطلب</h2>
          </div>

          <div className="info-row">
            <span className="label">رقم الطلب:</span>
            <span className="value">{orderData.order_number || `#${orderData.id}`}</span>
          </div>

          {paymentData && (
            <>
              <div className="info-row">
                <span className="label">حالة الدفع:</span>
                <span className="value success">
                  <span className="status-dot"></span>
                  {paymentData.payment_status === 'completed' ? 'تم الدفع' : 'قيد المعالجة'}
                </span>
              </div>

              <div className="info-row">
                <span className="label">المبلغ المدفوع:</span>
                <span className="value amount">${paymentData.amount_paid}</span>
              </div>
            </>
          )}

          <div className="info-row">
            <span className="label">اسم المستلم:</span>
            <span className="value">{orderData.customer_name}</span>
          </div>

          <div className="info-row">
            <span className="label">البريد الإلكتروني:</span>
            <span className="value">{orderData.customer_email}</span>
          </div>

          <div className="info-row">
            <span className="label">الهاتف:</span>
            <span className="value">{orderData.customer_phone}</span>
          </div>

          <div className="info-row">
            <span className="label">عنوان التوصيل:</span>
            <span className="value">{orderData.address}, {orderData.city}</span>
          </div>
        </div>

        <div className="next-steps">
          <h3>ما التالي؟</h3>
          <ul>
            <li>✅ سيتم إرسال بريد إلكتروني يحتوي على تفاصيل الطلب</li>
            <li>📦 سيتم تجهيز طلبك خلال 1-2 يوم عمل</li>
            <li>🚚 سنرسل لك رابط تتبع الشحنة عند الإرسال</li>
          </ul>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn-primary">
            العودة للصفحة الرئيسية
          </Link>
          <Link to="/profile" className="btn-secondary">
            عرض طلباتي
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
