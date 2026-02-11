// src/components/PaymentMethodSelector.js

import React from 'react';
import '../styles/PaymentMethodSelector.css';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    {
      id: 'paymob',
      name: 'Paymob',
      description: 'الدفع بالبطاقة أو فوري أو المحافظ الإلكترونية',
      icon: '💳',
      available: true,
      features: ['فيزا', 'ماستركارد', 'فوري', 'فودافون كاش']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'الدفع ببطاقة ائتمانية دولية',
      icon: '🌐',
      available: true,
      features: ['Visa', 'Mastercard', 'American Express']
    },
    {
      id: 'cash',
      name: 'الدفع عند الاستلام',
      description: 'ادفع نقداً عند استلام طلبك',
      icon: '💵',
      available: true,
      features: ['دفع نقدي', 'عند الاستلام']
    }
  ];

  return (
    <div className="payment-method-selector">
      <h3>اختر طريقة الدفع</h3>
      <div className="payment-methods-grid">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''} ${!method.available ? 'disabled' : ''}`}
            onClick={() => method.available && onMethodChange(method.id)}
          >
            <div className="method-icon">{method.icon}</div>
            <div className="method-info">
              <h4>{method.name}</h4>
              <p className="method-description">{method.description}</p>
              <div className="method-features">
                {method.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>
            {selectedMethod === method.id && (
              <div className="selected-indicator">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
