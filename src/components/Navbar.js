import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() ?? '👤';
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">متجر الكتب</span>
        </div>

        <div className="navbar-menu">
          <button 
            className={`nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
            title="الرئيسية"
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">الرئيسية</span>
          </button>

          <button 
            className={`nav-item ${isActive('/books') ? 'active' : ''}`}
            onClick={() => navigate('/books')}
            title="الكتب"
          >
            <span className="nav-icon">📖</span>
            <span className="nav-text">الكتب</span>
          </button>

          {/* Admin only - Dashboard */}
          {isAdmin && (
            <button 
              className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
              title="لوحة التحكم - للإداريين فقط"
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">لوحة التحكم</span>
            </button>
          )}

          {/* Admin only - Orders Management */}
          {/* {isAdmin && (
            <button 
              className={`nav-item ${isActive('/orders') ? 'active' : ''}`}
              onClick={() => navigate('/orders')}
              title="إدارة الطلبات - للإداريين فقط"
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">إدارة الطلبات</span>
            </button>
          )} */}

          {/* Admin only - Reports */}
          {/* {isAdmin && (
            <button 
              className={`nav-item ${isActive('/reports') ? 'active' : ''}`}
              onClick={() => navigate('/reports')}
              title="التقارير - للإداريين فقط"
            >
              <span className="nav-icon">📈</span>
              <span className="nav-text">التقارير</span>
            </button>
          )} */}

          {/* Customer - Favorites */}
          {user && !isAdmin && (
            <button 
              className={`nav-item ${isActive('/favorites') ? 'active' : ''}`}
              onClick={() => navigate('/favorites')}
              title="المفضلات"
            >
              <span className="nav-icon">❤️</span>
              <span className="nav-text">المفضلات</span>
            </button>
          )}

          <button 
            className={`nav-item ${isActive('/cart') ? 'active' : ''}`}
            onClick={() => navigate('/cart')}
            title="سلة التسوق"
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-text">السلة</span>
          </button>

        <div className="nav-divider"></div>
        {user ? (
          <>
          <button 
            className={`nav-item user-profile-btn ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
            title={`${user.name}`}
          >
            {user.avatar ? (
              <img 
                src={`http://127.0.0.1:8000${user.avatar}`} 
                alt={user.name} 
                className="nav-avatar-image"
              />
            ) : (
              <span className="nav-icon">{userInitial}</span>
            )}
            <span className="nav-text">{user.name}</span>
          </button>

          <button 
            className="nav-item"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              navigate('/login');
            }}
            title="تسجيل خروج"
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-text">تسجيل خروج</span>
          </button>
          </>
        ) : (
          <>
            <button 
              className={`nav-item ${isActive('/login') ? 'active' : ''}`}
              onClick={() => navigate('/login')}
              title="تسجيل دخول"
            >
              <span className="nav-icon">🔐</span>
              <span className="nav-text">دخول</span>
            </button>

            <button 
              className={`nav-item ${isActive('/register') ? 'active' : ''}`}
              onClick={() => navigate('/register')}
              title="تسجيل جديد"
            >
              <span className="nav-icon">✍️</span>
              <span className="nav-text">تسجيل</span>
            </button>
          </>
        )}
         

        <div className="navbar-toggle">
          <span className="toggle-icon">☰</span>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
