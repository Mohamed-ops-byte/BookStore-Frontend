// src/components/CheckoutForm.js

import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import '../styles/CheckoutForm.css';

const CheckoutForm = ({ orderId, amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const CARD_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setPaymentError(event.error ? event.error.message : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      setPaymentError('خطأ في تحميل Stripe');
      setLoading(false);
      return;
    }

    try {
      // 1. طلب Payment Intent من Backend
      const createIntentResponse = await fetch('http://127.0.0.1:8000/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: Math.round(amount * 100), // تحويل إلى cents
        }),
      });

      const intentData = await createIntentResponse.json();

      if (!intentData.success) {
        setPaymentError(intentData.message || 'خطأ في إنشاء نية الدفع');
        setLoading(false);
        return;
      }

      // 2. تأكيد الدفع مع Stripe
      const confirmResponse = await stripe.confirmCardPayment(
        intentData.data.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              // يمكن إضافة بيانات إضافية هنا
            }
          }
        }
      );

      if (confirmResponse.error) {
        setPaymentError(confirmResponse.error.message);
        toast.error(`خطأ في الدفع: ${confirmResponse.error.message}`);
        setLoading(false);
        return;
      }

      // 3. تأكيد الدفع في Backend
      const confirmPaymentResponse = await fetch('http://127.0.0.1:8000/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          payment_intent_id: intentData.data.payment_intent_id,
          order_id: orderId,
        }),
      });

      const confirmData = await confirmPaymentResponse.json();

      if (confirmData.success) {
        toast.success('✅ تم الدفع بنجاح!');
        if (onPaymentSuccess) {
          onPaymentSuccess(confirmData.data);
        }
      } else {
        setPaymentError(confirmData.message || 'خطأ في تأكيد الدفع');
        toast.error(confirmData.message);
      }
    } catch (error) {
      console.error('خطأ في الدفع:', error);
      setPaymentError(error.message || 'خطأ في معالجة الدفع');
      toast.error('خطأ في معالجة الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>معلومات الدفع</h2>
      
      <div className="card-element-container">
        <label>رقم البطاقة الائتمانية</label>
        <CardElement
          options={CARD_OPTIONS}
          onChange={handleCardChange}
        />
      </div>

      {paymentError && (
        <div className="payment-error">
          ⚠️ {paymentError}
        </div>
      )}

      <div className="payment-summary">
        <p>المبلغ المراد دفعه: <strong>${amount.toFixed(2)}</strong></p>
      </div>

      <button
        type="submit"
        disabled={!stripe || !cardComplete || loading}
        className="btn-pay"
      >
        {loading ? (
          <>
            <span className="spinner"></span> جاري معالجة الدفع...
          </>
        ) : (
          `الدفع الآن - $${amount.toFixed(2)}`
        )}
      </button>

      <p className="payment-note">
        🔒 الدفع آمن تماماً عبر Stripe
      </p>
    </form>
  );
};

export default CheckoutForm;
