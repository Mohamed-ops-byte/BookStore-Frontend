// src/config/stripeConfig.js

export const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OUXcgAVGJZ8OwjUxZ6KmLjYeYh8a7y3HyY5kL9mN2o3pQ4rS5tU6vW7xY8z';

export const getStripePublishableKey = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/payments/publishable-key');
    const data = await response.json();
    
    if (data.success) {
      return data.publishable_key;
    }
  } catch (error) {
    console.error('خطأ في الحصول على مفتاح Stripe:', error);
  }
  
  return STRIPE_PUBLIC_KEY;
};
