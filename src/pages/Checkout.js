import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, clearCart } from '../Redux/Actions/cartAction';
import { createOrderEntry } from '../Redux/Actions/orderAction';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: confirm

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('paymob'); // Default to Paymob
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartChecked, setCartChecked] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // تحقق من التوكن
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ لا يوجد توكن - يجب تسجيل الدخول');
      alert('يجب تسجيل الدخول أولاً');
      navigate('/login');
    }
  }, [navigate]);
  
  useEffect(() => {
    dispatch(getCartItems());
    setCartChecked(true);
  }, [dispatch]);

  useEffect(() => {
    if (!cartChecked || orderPlaced) return;
    if (!items.length) {
      navigate('/cart');
    }
  }, [cartChecked, items, navigate, orderPlaced]);

  const summary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
      0
    );
    const shipping = subtotal > 500 ? 0 : subtotal > 0 ? 50 : 0;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [items]);

  const validateShippingForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'الاسم الأخير مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'بريد إلكتروني غير صحيح';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'الرمز البريدي مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    // لا نحتاج لتحقق من بيانات الدفع هنا
    // لأن Paymob و Stripe سيتولى معالجة البيانات الحساسة
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateShippingForm()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validatePaymentForm()) {
        if (paymentMethod === 'cash') {
          setStep(3);
        } else {
          handleSubmitOrder();
        }
      }
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    if (!items.length) return;
    setIsProcessing(true);
    const customer = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      notes: formData.notes,
    };

    const orderPayload = {
      status: 'قيد التنفيذ',
      payment_method: paymentMethod === 'card' ? 'stripe' : paymentMethod === 'paymob' ? 'paymob' : 'cash',
      shipping_status: 'قيد التجهيز',
      customer: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        notes: formData.notes,
      },
      totals: {
        subtotal: summary.subtotal,
        shipping: summary.shipping,
        tax: summary.tax,
        total: summary.total,
      },
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        category: item.category,
        quantity: item.quantity,
        price: parseFloat(item.price) || 0,
      })),
      notes: formData.notes,
    };

    try {
      console.log('📤 Sending order payload:', orderPayload);
      console.log('🔐 Token:', localStorage.getItem('token') ? 'exists' : 'NOT FOUND');
      
      const response = await dispatch(createOrderEntry(orderPayload));
      console.log('📥 Order response:', response);

      if (!response?.success) {
        const errorMsg = response?.message || response?.error || 'تعذر إنشاء الطلب';
        console.error('❌ Order creation failed:', errorMsg);
        
        // تحقق من خطأ المصادقة
        if (errorMsg.includes('تسجيل الدخول') || errorMsg.includes('Session expired')) {
          alert('⚠️ انتهت جلسة تسجيل الدخول\n\nيرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        
        throw new Error(errorMsg);
      }

      console.log('✅ Order created successfully:', response.data);
      setOrderPlaced(true);
      
      // إذا كانت طريقة الدفع بطاقة (Stripe أو Paymob)، اذهب لصفحة الدفع
      if (paymentMethod === 'card' || paymentMethod === 'paymob') {
        console.log('🔄 Navigating to payment page with method:', paymentMethod);
        setIsProcessing(false);
        navigate('/payment', {
          state: {
            order: {
              ...response.data,
              customer_name: `${formData.firstName} ${formData.lastName}`,
              customer_email: formData.email,
              customer_phone: formData.phone,
              address: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              totals: summary,
              amount: summary.total,
            },
            paymentMethod: paymentMethod === 'card' ? 'stripe' : 'paymob'
          }
        });
        console.log('✅ Navigation initiated');
      } else {
        // إذا كان الدفع عند الاستلام، اذهب مباشرة للتأكيد
        dispatch(clearCart());
        setTimeout(() => {
          setIsProcessing(false);
          navigate('/order-confirmation', {
            state: {
              order: {
                ...response.data,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                customer_email: formData.email,
                customer_phone: formData.phone,
                address: formData.address,
                city: formData.city,
              },
              payment: {
                payment_status: 'pending',
                payment_method: 'cash',
              }
            }
          });
        }, 800);
      }
    } catch (error) {
      console.error('❌ Error submitting order:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setIsProcessing(false);
      
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء تأكيد الطلب من الخادم';
      
      // عرض تفاصيل الخطأ بوضوح
      let displayMessage = `⚠️ ${errorMessage}`;
      
      if (error.response?.status === 401) {
        displayMessage += '\n\n🔐 انتهت جلسة تسجيل الدخول';
        displayMessage += '\nيرجى تسجيل الدخول مرة أخرى';
        setTimeout(() => {
          localStorage.removeItem('token');
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 500) {
        displayMessage += '\n\n⚙️ خطأ في الخادم';
        displayMessage += '\nيرجى المحاولة مرة أخرى';
        if (error.response?.data?.debug) {
          console.error('Debug info:', error.response.data.debug);
        }
      }
      
      alert(displayMessage);
    }
  };

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          ← العودة للسلة
        </button>
        <div>
          <h1>✅ اتمام الشراء</h1>
          <p className="subtitle">الخطوة {step} من 3</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="checkout-progress">
        <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
          <div className="checkout-step-number">1</div>
          <span className="checkout-step-label">الشحن</span>
        </div>
        <div className={`checkout-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
          <div className="checkout-step-number">2</div>
          <span className="checkout-step-label">الدفع</span>
        </div>
        <div className={`checkout-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
          <div className="checkout-step-number">3</div>
          <span className="checkout-step-label">التأكيد</span>
        </div>
      </div>

      <div className="checkout-content">
        <main className="checkout-form">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <section className="form-section">
              <h2>معلومات الشحن</h2>
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label>الاسم الأول *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="أحمد"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>الاسم الأخير *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="محمد"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>البريد الإلكتروني *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ahmed@example.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>رقم الهاتف *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01012345678"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>العنوان *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="شارع النيل، القاهرة"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-msg">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>المدينة *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="القاهرة"
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-msg">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>الرمز البريدي *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="11111"
                      className={errors.postalCode ? 'error' : ''}
                    />
                    {errors.postalCode && <span className="error-msg">{errors.postalCode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>ملاحظات إضافية</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="أضف أي ملاحظات للتوصيل..."
                    rows="4"
                  ></textarea>
                </div>
              </form>
            </section>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <section className="form-section">
              <h2>طريقة الدفع</h2>
              
              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'paymob' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="paymob"
                    checked={paymentMethod === 'paymob'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="icon">💳</span>
                    <div>
                      <p className="title">Paymob (المفضل)</p>
                      <p className="subtitle">بطاقات + فودافون كاش + فوري</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="icon">🌐</span>
                    <div>
                      <p className="title">Stripe (دولي)</p>
                      <p className="subtitle">بطاقات ائتمان دولية</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="icon">💵</span>
                    <div>
                      <p className="title">الدفع عند الاستلام</p>
                      <p className="subtitle">ادفع عند استلام الطلب</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="payment-info-note">
                <p>💡 ستنتقل لصفحة الدفع الآمنة بعد تأكيد الطلب</p>
              </div>
            </section>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <section className="form-section">
              <h2>تأكيد الطلب</h2>
              
              <div className="confirmation-block">
                <h3>معلومات الشحن</h3>
                <div className="info-row">
                  <span className="label">الاسم:</span>
                  <span className="value">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="info-row">
                  <span className="label">البريد الإلكتروني:</span>
                  <span className="value">{formData.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">الهاتف:</span>
                  <span className="value">{formData.phone}</span>
                </div>
                <div className="info-row">
                  <span className="label">العنوان:</span>
                  <span className="value">{formData.address}, {formData.city}, {formData.postalCode}</span>
                </div>
              </div>

              <div className="confirmation-block">
                <h3>طريقة الدفع</h3>
                <div className="info-row">
                  <span className="label">الطريقة:</span>
                  <span className="value">
                    {paymentMethod === 'paymob' && '💳 Paymob'}
                    {paymentMethod === 'card' && '🌐 Stripe'}
                    {paymentMethod === 'cash' && '💵 الدفع عند الاستلام'}
                  </span>
                </div>
              </div>

              <div className="confirmation-message">
                <p>✅ تم التحقق من جميع البيانات بنجاح</p>
              </div>
            </section>
          )}
        </main>

        {/* Order Summary Sidebar */}
        <aside className="order-summary-sidebar">
          <h3>ملخص الطلب</h3>
          
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <div>
                  <p className="item-title">{item.title}</p>
                  <p className="item-qty">الكمية: {item.quantity}</p>
                </div>
                <p className="item-price">
                  {(
                    (parseFloat(item.price) || 0) * item.quantity
                  ).toLocaleString('ar-EG')} ج.م
                </p>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>السعر الأساسي</span>
            <span>{summary.subtotal.toLocaleString('ar-EG')} ج.م</span>
          </div>
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

          <div className="security-info">
            <p>🔒 دفع آمن معتمد</p>
          </div>
        </aside>
      </div>

      {/* Action Buttons */}
      <div className="checkout-actions">
        {step > 1 && (
          <button className="btn-secondary" onClick={handlePreviousStep}>
            ← الخطوة السابقة
          </button>
        )}
        
        {step < 3 && (
          <button className="btn-primary" onClick={handleNextStep}>
            التالي →
          </button>
        )}

        {step === 3 && (
          <button 
            className="btn-success" 
            onClick={handleSubmitOrder}
            disabled={isProcessing}
          >
            {isProcessing ? '⏳ جاري المعالجة...' : '✓ تأكيد الطلب'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
