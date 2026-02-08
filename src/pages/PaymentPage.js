// src/pages/PaymentPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import PaymobCheckout from '../components/PaymobCheckout';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { STRIPE_PUBLIC_KEY } from '../config/stripeConfig';
import '../styles/PaymentPage.css';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('paymob'); // Default to Paymob

  useEffect(() => {
    console.log('💳 PaymentPage mounted');
    console.log('📦 Location state:', location.state);
    
    // Get order data from navigation state
    if (location.state?.order) {
      console.log('✅ Order data found:', location.state.order);
      setOrderData(location.state.order);
      
      const selectedMethod = location.state?.paymentMethod ||
          location.state?.order?.payment_method ||
          'paymob';
      
      console.log('💰 Selected payment method:', selectedMethod);
      setPaymentMethod(selectedMethod);
    } else {
      // إذا لم يكن هناك بيانات طلب، ارجع للصفحة الرئيسية
      console.error('❌ No order data in location.state');
      alert('⚠️ لا توجد بيانات للطلب\n\nسيتم إعادة توجيهك للصفحة الرئيسية');
      navigate('/');
    }
  }, [location, navigate]);

  const handlePaymentSuccess = (paymentDetails) => {
    // بعد نجاح الدفع، انتقل لصفحة تأكيد الطلب
    navigate('/order-confirmation', {
      state: {
        order: orderData,
        payment: paymentDetails,
      },
    });
  };

  if (!orderData) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>إتمام عملية الدفع</h1>
          <p>طلب رقم: <strong>{orderData.order_number || orderData.id}</strong></p>
        </div>

        <div className="payment-content">
          <div className="order-summary-section">
            <h3>ملخص الطلب</h3>
            <div className="order-details">
              <div className="detail-row">
                <span>الاسم:</span>
                <strong>{orderData.customer_name}</strong>
              </div>
              <div className="detail-row">
                <span>البريد الإلكتروني:</span>
                <strong>{orderData.customer_email}</strong>
              </div>
              <div className="detail-row">
                <span>الهاتف:</span>
                <strong>{orderData.customer_phone}</strong>
              </div>
              <div className="detail-row">
                <span>العنوان:</span>
                <strong>{orderData.address}, {orderData.city}</strong>
              </div>
              
              <div className="divider"></div>
              
              <div className="detail-row total">
                <span>المبلغ الإجمالي:</span>
                <strong className="amount">
                  {orderData.totals?.grandTotal || orderData.amount || 0} جنيه
                </strong>
              </div>
            </div>
          </div>

          <div className="payment-method-section">
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />

            {paymentMethod === 'stripe' && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  orderId={orderData.id}
                  amount={orderData.totals?.grandTotal || orderData.amount || 0}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}

            {paymentMethod === 'paymob' && (
              <PaymobCheckout
                orderId={orderData.id}
                amount={orderData.totals?.grandTotal || orderData.amount || 0}
                billingData={{
                  firstName: orderData.customer_name?.split(' ')[0] || 'User',
                  lastName: orderData.customer_name?.split(' ')[1] || 'Name',
                  email: orderData.customer_email,
                  phone: orderData.customer_phone,
                  city: orderData.city,
                  address: orderData.address,
                  postalCode: orderData.postal_code || '12345',
                }}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}

            {paymentMethod === 'cash' && (
              <div className="cash-payment-info">
                <h3>الدفع عند الاستلام</h3>
                <p>سيتم تحصيل المبلغ عند استلام الطلب</p>
                <button
                  className="btn-confirm-cash"
                  onClick={() => handlePaymentSuccess({ payment_method: 'cash', payment_status: 'pending' })}
                >
                  تأكيد الطلب
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="btn-cancel"
          onClick={() => navigate(-1)}
        >
          إلغاء والعودة
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
