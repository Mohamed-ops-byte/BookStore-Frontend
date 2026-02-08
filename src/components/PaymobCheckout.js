// src/components/PaymobCheckout.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/PaymobCheckout.css';

const PaymobCheckout = ({ orderId, amount, billingData, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);

    console.log('💳 Initiating Paymob payment:', {
      orderId,
      amount,
      billingData
    });

    try {
      const payload = {
        order_id: orderId,
        amount: amount,
        billing_data: {
          first_name: billingData.firstName || billingData.first_name,
          last_name: billingData.lastName || billingData.last_name,
          email: billingData.email,
          phone: billingData.phone,
          city: billingData.city,
          street: billingData.address || 'NA',
          postal_code: billingData.postalCode || billingData.postal_code || 'NA',
        },
      };

      console.log('📤 Paymob payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/api/paymob/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log('📥 Paymob response:', {
        status: response.status,
        data
      });

      if (data.success) {
        setIframeUrl(data.data.iframe_url);
        setPaymentInitiated(true);
        toast.success('جاري فتح صفحة الدفع...');
        
        // Start checking payment status
        startPaymentStatusCheck(orderId);
      } else {
        toast.error(data.message || 'خطأ في إنشاء عملية الدفع');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('خطأ في الاتصال بخادم الدفع');
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusCheck = (orderId) => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/paymob/verify/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const data = await response.json();

        if (data.success && data.data.payment_status === 'completed') {
          clearInterval(checkInterval);
          toast.success('✅ تم الدفع بنجاح!');
          if (onPaymentSuccess) {
            onPaymentSuccess(data.data);
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 3000); // Check every 3 seconds

    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 300000);
  };

  return (
    <div className="paymob-checkout">
      {!paymentInitiated ? (
        <div className="paymob-info">
          <h2>الدفع عبر Paymob</h2>
          
          <div className="payment-summary">
            <div className="summary-row">
              <span>المبلغ المطلوب:</span>
              <strong>{amount} جنيه</strong>
            </div>
          </div>

          <div className="payment-methods-info">
            <h3>طرق الدفع المتاحة:</h3>
            <div className="methods-list">
              <div className="method-item">
                <span className="method-icon">💳</span>
                <span>بطاقة ائتمانية (فيزا - ماستركارد)</span>
              </div>
              <div className="method-item">
                <span className="method-icon">📱</span>
                <span>المحافظ الإلكترونية (فودافون كاش)</span>
              </div>
              <div className="method-item">
                <span className="method-icon">🏪</span>
                <span>فوري</span>
              </div>
            </div>
          </div>

          <button
            className="btn-pay-paymob"
            onClick={initiatePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> جاري التحضير...
              </>
            ) : (
              <>الانتقال للدفع - {amount} جنيه</>
            )}
          </button>

          <p className="security-note">
            🔒 عملية الدفع آمنة ومشفرة بالكامل
          </p>
        </div>
      ) : (
        <div className="paymob-iframe-container">
          <div className="iframe-header">
            <h3>أكمل عملية الدفع</h3>
            <p>سيتم التحديث تلقائياً بعد إتمام الدفع</p>
          </div>
          
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              className="paymob-iframe"
              title="Paymob Payment"
              frameBorder="0"
            />
          )}

          <div className="iframe-footer">
            <p className="status-message">
              ⏳ جاري انتظار تأكيد الدفع...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymobCheckout;
