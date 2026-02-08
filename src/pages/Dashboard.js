import React, { useEffect, useState } from 'react';

import { useDispatch,useSelector } from 'react-redux';
import {getAllBooks} from '../Redux/Actions/BookAction';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allBooks = useSelector(state => state.allBooks?.book) || [];

  useEffect(() => {
    const fetchBooks = async () => {
      await dispatch(getAllBooks());
    };
    fetchBooks();
  }, [dispatch]);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });


  // بيانات تجريبية - يمكنك استبدالها بـ API calls
  const stats = {
    totalBooks: 247,
    availableBooks: 189,
    soldToday: 23,
    revenue: 12450
  };

  const recentBooks = [
    { id: 1, title: 'البؤساء', author: 'فيكتور هيجو', status: 'متوفر', addedDate: '2026-01-18' },
    { id: 2, title: 'الحرب والسلام', author: 'ليو تولستوي', status: 'نفذ', addedDate: '2026-01-17' },
    { id: 3, title: 'مختصر تاريخ الزمن', author: 'ستيفن هوكينج', status: 'متوفر', addedDate: '2026-01-16' },
  ];

  const recentOrders = [
    { id: '#1234', book: 'البؤساء', customer: 'أحمد محمد', amount: '150 ج.م', status: 'مكتمل' },
    { id: '#1235', book: 'تاريخ الحضارات', customer: 'فاطمة علي', amount: '250 ج.م', status: 'قيد التنفيذ' },
    { id: '#1236', book: 'الحرب والسلام', customer: 'محمود سعيد', amount: '180 ج.م', status: 'مكتمل' },
  ];

  const topCategories = [
    { name: 'روايات', count: 85, percentage: 34 },
    { name: 'علمية', count: 62, percentage: 25 },
    { name: 'تاريخية', count: 48, percentage: 19 },
    { name: 'دينية', count: 52, percentage: 22 },
  ];

  return (
    <div className="dashboard-container">

    {user?(
      <>
      {/* Check if user is admin */}
      {user.role !== 'admin' ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          color: 'white',
          margin: '20px'
        }}>
          <h1 style={{ marginBottom: '20px' }}>🔒 محصورة على الإداريين</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            عذراً، لوحة التحكم متاحة فقط للمسؤولين. 
            <br />
            إذا كنت مسؤولاً، يرجى تسجيل الدخول بحساب إداري.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            العودة للرئيسية
          </button>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">📊 لوحة التحكم</h1>
          <p className="dashboard-subtitle">مرحباً بك في لوحة التحكم الخاصة بمتجر الكتب</p>
        </div>
        <div className="header-date">
          <span className="date-label">التاريخ:</span>
          <span className="date-value">{new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📚</div>
          <div className="stat-details">
            <h3 className="stat-number">{allBooks.length}</h3>
            <p className="stat-label">إجمالي الكتب</p>
          </div>
          <div className="stat-trend positive">+12%</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <h3 className="stat-number">{stats.availableBooks}</h3>
            <p className="stat-label">كتب متوفرة</p>
          </div>
          <div className="stat-trend positive">+8%</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🛒</div>
          <div className="stat-details">
            <h3 className="stat-number">{stats.soldToday}</h3>
            <p className="stat-label">مبيعات اليوم</p>
          </div>
          <div className="stat-trend positive">+15%</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <h3 className="stat-number">{stats.revenue.toLocaleString()}</h3>
            <p className="stat-label">الإيرادات (ج.م)</p>
          </div>
          <div className="stat-trend positive">+22%</div>
        </div>
      </div>
      </>
    )}

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="content-left">
          {/* Chart Placeholder */}
          <div className="widget chart-widget">
            <div className="widget-header">
              <h2 className="widget-title">📈 إحصائيات المبيعات</h2>
              <select className="chart-period">
                <option>آخر 7 أيام</option>
                <option>آخر 30 يوم</option>
                <option>آخر 3 أشهر</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="bar" style={{height: '60%'}}><span>السبت</span></div>
                <div className="bar" style={{height: '75%'}}><span>الأحد</span></div>
                <div className="bar" style={{height: '50%'}}><span>الإثنين</span></div>
                <div className="bar" style={{height: '85%'}}><span>الثلاثاء</span></div>
                <div className="bar" style={{height: '70%'}}><span>الأربعاء</span></div>
                <div className="bar" style={{height: '90%'}}><span>الخميس</span></div>
                <div className="bar active" style={{height: '95%'}}><span>الجمعة</span></div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="widget">
            <div className="widget-header">
              <h2 className="widget-title">🛍️ آخر الطلبات</h2>
              <a href="#orders" className="widget-link">عرض الكل</a>
            </div>
            <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">{order.id}</span>
                    <span className="order-book">{order.book}</span>
                    <span className="order-customer">{order.customer}</span>
                  </div>
                  <div className="order-details">
                    <span className="order-amount">{order.amount}</span>
                    <span className={`order-status ${order.status === 'مكتمل' ? 'completed' : 'pending'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-right">
          {/* Quick Actions */}
          <div className="widget quick-actions">
            <h2 className="widget-title">⚡ إجراءات سريعة</h2>
            <div className="actions-grid">
              <button className="action-btn add" onClick={() => window.location.href = `/books/create`}>
                <span className="action-icon">➕</span>
                <span className="action-text" >إضافة كتاب</span>
              </button>
              <button className="action-btn view" onClick={() => window.location.href = `/books`}>
                <span className="action-icon">📋</span>
                <span className="action-text">عرض الكتب</span>
              </button>
              <button className="action-btn orders" onClick={() => navigate('/orders')}>
                <span className="action-icon">📦</span>
                <span className="action-text">إدارة الطلبات</span>
              </button>
              <button className="action-btn reports" onClick={() => navigate('/reports')}>
                <span className="action-icon">📊</span>
                <span className="action-text">التقارير</span>
              </button>
            </div>
          </div>

          {/* Top Categories */}
          <div className="widget">
            <div className="widget-header">
              <h2 className="widget-title">🏆 أكثر الفئات مبيعاً</h2>
            </div>
            <div className="categories-list">
              {topCategories.map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.count} كتاب</span>
                  </div>
                  <div className="category-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${category.percentage}%`}}
                      ></div>
                    </div>
                    <span className="progress-percentage">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Books */}
          <div className="widget">
            <div className="widget-header">
              <h2 className="widget-title">📚 آخر الكتب المضافة</h2>
            </div>
            <div className="books-list">
              {allBooks
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 3)
                .map((book) => (
                <div key={book.id} className="book-item">
                  <div className="book-info">
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                  </div>
                  <div className="book-meta">
                    <span className={`book-status ${book.stock > 0 ? 'available' : 'unavailable'}`}>
                      {book.stock > 0 ? 'متوفر' : 'نفذ'}
                    </span>
                    <span className="book-date">{new Date(book.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </>
      ) : (
        <div className="unauthorized-message">
          <h2>🚫 غير مصرح بالدخول</h2>
          <p>الرجاء تسجيل الدخول للوصول إلى لوحة التحكم والاستفادة من جميع الميزات.</p>
          <button className="login-button" onClick={() => window.location.href = '/login'}>
            تسجيل الدخول
          </button>
        </div>
      )}
    </div>
    );
        
}

export default Dashboard;
