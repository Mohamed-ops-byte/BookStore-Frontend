import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Redux/Actions/authAction';
import { useState } from 'react';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { notify } from '../utils/notify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Login = () => {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const dispatch = useDispatch();

  const handleLogin =async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      notify('من فضلك أدخل البريد الإلكتروني وكلمة المرور', 'error');
      return;
    }

    console.log('handleLogin called with:', { email, password });

    const data = {
      email: email,
      password: password
    };
    
    console.log('Dispatching loginUser...');
    await dispatch(loginUser(data));
    console.log('loginUser dispatch completed');

  };
  const res = useSelector(state => state.authReducer.loginUser)

  useEffect(() => {
    console.log('useEffect triggered - res:', res);
    
    // تحقق من وجود بيانات حقيقية (ليس array فاضي أو object فاضي)
    if (res && typeof res === 'object' && !Array.isArray(res) && Object.keys(res).length > 0) {
      console.log('Processing response:', res);
      const token = res.data?.token;
      const user = res.data?.user;
      
      if (res.success && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        notify("تم تسجيل الدخول بنجاح", "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
        return;
      }

      if (res.errors && typeof res.errors === 'object') {
        const firstError = Object.values(res.errors).flat().find(Boolean);
        notify(firstError || "بيانات الدخول غير صحيحة", "error");
        return;
      }

      // أخطاء التحقق
      if (!res.success || res.message) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        const msg = res.message || "بيانات الدخول غير صحيحة";
        notify(msg, "error");
        return;
      }

      // فشل عام
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      notify("حدث خطأ أثناء تسجيل الدخول", "error");
      return;
    }
  }, [res]);



  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">تسجيل الدخول</h2>
          <p className="auth-subtitle">مرحباً بك مرة أخرى</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@email.com"
              name="email"
              id="email"
              value={email}
              setEmail={e => setEmail(e.target.value)}
            />
            
            <Input
              label="كلمة المرور"
              type="password"
              placeholder="••••••••"
              name="password"
              id="password"
              value={password}
              setPassword={e => setPassword(e.target.value)}
            />
            
            <div className="forgot-password">
              <a href="#forgot" className="forgot-link">نسيت كلمة المرور؟</a>
            </div>
            
            <Button text="تسجيل الدخول" variant="primary" type="submit" />
            
            <div className="auth-switch">
              <span>ليس لديك حساب؟ </span>
              <Link to="/register" className="auth-link">إنشاء حساب جديد</Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
