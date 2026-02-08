// src/Redux/Actions/paymentAction.js

import {
  CREATE_PAYMENT_INTENT,
  PAYMENT_PROCESSING,
  PAYMENT_SUCCESS,
  PAYMENT_ERROR,
  CLEAR_PAYMENT_ERROR,
  PAYMENT_LOADING,
} from '../Type';

const API_URL = 'http://127.0.0.1:8000/api';

// Get Publishable Key
export const getPublishableKey = () => async (dispatch) => {
  try {
    const response = await fetch(`${API_URL}/payments/publishable-key`);
    const data = await response.json();
    
    if (data.success) {
      return data.publishable_key;
    }
  } catch (error) {
    console.error('خطأ في الحصول على مفتاح Stripe:', error);
    throw error;
  }
};

// Create Payment Intent
export const createPaymentIntent = (orderId, amount) => async (dispatch) => {
  dispatch({ type: PAYMENT_LOADING });

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: 'يجب تسجيل الدخول أولاً',
      });
      return;
    }

    const response = await fetch(`${API_URL}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: Math.round(amount * 100), // تحويل إلى cents
      }),
    });

    const data = await response.json();

    if (data.success) {
      dispatch({
        type: CREATE_PAYMENT_INTENT,
        payload: data.data,
      });
      return data.data;
    } else {
      dispatch({
        type: PAYMENT_ERROR,
        payload: data.message || 'خطأ في إنشاء نية الدفع',
      });
    }
  } catch (error) {
    dispatch({
      type: PAYMENT_ERROR,
      payload: error.message || 'خطأ في إنشاء نية الدفع',
    });
  }
};

// Confirm Payment
export const confirmPayment = (paymentIntentId, orderId) => async (dispatch) => {
  dispatch({ type: PAYMENT_PROCESSING });

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: 'يجب تسجيل الدخول أولاً',
      });
      return;
    }

    const response = await fetch(`${API_URL}/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        order_id: orderId,
      }),
    });

    const data = await response.json();

    if (data.success) {
      dispatch({
        type: PAYMENT_SUCCESS,
        payload: data.data,
      });
      return data.data;
    } else {
      dispatch({
        type: PAYMENT_ERROR,
        payload: data.message || 'خطأ في تأكيد الدفع',
      });
    }
  } catch (error) {
    dispatch({
      type: PAYMENT_ERROR,
      payload: error.message || 'خطأ في تأكيد الدفع',
    });
  }
};

// Get Payment Status
export const getPaymentStatus = (paymentIntentId) => async (dispatch) => {
  try {
    const response = await fetch(
      `${API_URL}/payments/status/${paymentIntentId}`
    );
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error('خطأ في الحصول على حالة الدفع:', error);
  }
};

// Clear Payment Error
export const clearPaymentError = () => (dispatch) => {
  dispatch({ type: CLEAR_PAYMENT_ERROR });
};
