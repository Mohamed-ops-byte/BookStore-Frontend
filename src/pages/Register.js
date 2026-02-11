import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../Redux/Actions/authAction';
import { ToastContainer } from 'react-toastify';
import { notify } from '../utils/notify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // التحقق من المدخلات
    if (!name.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim()) {
      notify('من فضلك أكمل جميع الحقول', 'error');
      return;
    }

    if (!acceptTerms) {
      notify('يجب الموافقة على الشروط والأحكام', 'error');
      return;
    }

    if (password.length < 8) {
      notify('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
      return;
    }

    if (password !== passwordConfirmation) {
      notify('كلمة المرور غير متطابقة', 'error');
      return;
    }

    setLoading(true);

    const data = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation
    };

    await dispatch(registerUser(data));
  };

  const res = useSelector(state => state.authReducer.registerUser);

  useEffect(() => {
    if (res && typeof res === 'object' && !Array.isArray(res) && Object.keys(res).length > 0) {
      setLoading(false);

      const token = res.data?.token;
      const user = res.data?.user;

      if (res.success && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        notify("تم التسجيل بنجاح! جاري تحويلك...", "success");
        setTimeout(() => {
          navigate('/');
        }, 1500);
        return;
      }

      // أخطاء التحقق
      if (res.errors && typeof res.errors === 'object') {
        const errors = Object.values(res.errors).flat();
        errors.forEach(error => notify(error, "error"));
        return;
      }

      if (!res.success || res.message) {
        const msg = res.message || "فشل إنشاء الحساب";
        notify(msg, "error");
        return;
      }

      notify("حدث خطأ أثناء التسجيل", "error");
    }
  }, [res, navigate]);

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">إنشاء حساب جديد</h2>
          <p className="auth-subtitle">انضم إلينا اليوم</p>
          
          <form className="auth-form" onSubmit={handleRegister}>
            <Input
              label="الاسم الكامل"
              type="text"
              placeholder="أدخل اسمك الكامل"
              name="fullname"
              id="fullname"
              value={name}
              setEmail={(e) => setName(e.target.value)}
            />
            
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@email.com"
              name="email"
              id="email"
              value={email}
              setEmail={(e) => setEmail(e.target.value)}
            />
            
            <Input
              label="كلمة المرور"
              type="password"
              placeholder="••••••••"
              name="password"
              id="password"
              value={password}
              setPassword={(e) => setPassword(e.target.value)}
            />
            
            <Input
              label="تأكيد كلمة المرور"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordConfirmation}
              setPassword={(e) => setPasswordConfirmation(e.target.value)}
            />
            
            <div className="terms-container">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  className="checkbox-input"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>أوافق على <a href="#terms" className="terms-link">الشروط والأحكام</a></span>
              </label>
            </div>
            
            <Button 
              text={loading ? "جاري التسجيل..." : "إنشاء حساب"} 
              variant="primary" 
              type="submit"
              disabled={loading}
            />
            
            <div className="auth-switch">
              <span>لديك حساب بالفعل؟ </span>
              <Link to="/login" className="auth-link">تسجيل الدخول</Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
