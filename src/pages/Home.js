import React from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllBooks } from '../Redux/Actions/BookAction';
import { useSelector } from 'react-redux';
import { openCartModal } from '../Redux/Actions/modalAction';
import { getCartItems } from '../Redux/Actions/cartAction';
import ShoppingCart from '../components/ShoppingCart';
import AddToCartModal from '../components/AddToCartModal';

const Home = () => {

  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `http://127.0.0.1:8000/storage/${coverImage}`;
  };

    const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
     });
  const navigate = useNavigate();

const dispatch = useDispatch();
const backendBaseUrl = 'https://bookstore-backend-20qr.onrender.com';

const allbook = useSelector(state => state.allBooks?.book) || [];
const { totalItems } = useSelector(state => state.cart);
const [showAddModal, setShowAddModal] = useState(false);
const [selectedBook, setSelectedBook] = useState(null);

useEffect(() => {
  const fetchBooks = async () => {
    await dispatch(getAllBooks());
    await dispatch(getCartItems());
  };
  
  fetchBooks();
}, [dispatch]);

useEffect(() => {
  const fetchTest = async () => {
    try {
      const response = await fetch(`${backendBaseUrl}/test`);
      const data = await response.json();
      console.log('Backend /test response:', data);
    } catch (error) {
      console.log('Backend /test error:', error);
    }
  };

  fetchTest();
}, [backendBaseUrl]);

const handleOpenAddModal = (book) => {
  setSelectedBook(book);
  setShowAddModal(true);
};

const handleCloseAddModal = () => {
  setShowAddModal(false);
  setSelectedBook(null);
};

const handleOpenCart = () => {
  dispatch(openCartModal());
};


  // const featuredBooks = [
  //   { id: 1, title: 'البؤساء', author: 'فيكتور هيجو', price: '150', category: 'روايات' },
  //   { id: 2, title: 'مختصر تاريخ الزمن', author: 'ستيفن هوكينج', price: '200', category: 'علمية' },
  //   { id: 3, title: 'الحرب والسلام', author: 'ليو تولستوي', price: '180', category: 'روايات' },
  //   { id: 4, title: 'تاريخ الحضارات', author: 'ويل ديورانت', price: '250', category: 'تاريخية' },
  // ];

  // const categories = [
  //   { name: 'روايات', icon: '📖', count: 85 },
  //   { name: 'علمية', icon: '🔬', count: 62 },
  //   { name: 'تاريخية', icon: '🏛️', count: 48 },
  //   { name: 'دينية', icon: '🕌', count: 52 },
  //   { name: 'أطفال', icon: '🧸', count: 34 },
  //   { name: 'تنمية بشرية', icon: '💡', count: 41 },
  // ];

  // حصر عدد الكتب في كل فئة لعرض المطابق فقط
  const categoriesList = Object.entries(
    (Array.isArray(allbook) ? allbook : []).reduce((acc, book) => {
      const category = book?.category || 'غير مصنف';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  return (
    <div className="home-container">
      {/* Cart Button */}
      <button className="floating-cart-btn" onClick={handleOpenCart}>
        🛒
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
      <h1 className="hero-title">
        مرحباً بك في
        <span className="highlight"> متجر الكتب</span>
      </h1>
            <p className="hero-subtitle">
              اكتشف عالماً من المعرفة والإبداع مع أفضل مجموعة من الكتب العربية والعالمية
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/books')}>
                استكشف الكتب
              </button>
              {user ? null : (
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                تسجيل الدخول
              </button>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-books-stack">
              <div className="book-3d book-1">📚</div>
              <div className="book-3d book-2">📘</div>
              <div className="book-3d book-3">📙</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">📚</div>
            <div className="stat-number">247+</div>
            <div className="stat-label">كتاب متنوع</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-number">1,500+</div>
            <div className="stat-label">عميل سعيد</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">4.9</div>
            <div className="stat-label">تقييم العملاء</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🚚</div>
            <div className="stat-number">24/7</div>
            <div className="stat-label">توصيل سريع</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">تصفح حسب الفئة</h2>
          <p className="section-subtitle">اختر الفئة المفضلة لديك</p>
        </div>
        <div className="categories-grid">
          {categoriesList.length === 0 ? (
            <p className="category-empty">لا توجد فئات مطابقة حالياً</p>
          ) : (
            categoriesList.map((cat) => (
              <div key={cat.name} className="category-card">
                <div className="category-icon">📚</div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-count">{cat.count} كتاب</p>
              </div>
            ))
          )}
        </div>
      </section>
      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">الكتب المميزة</h2>
          <p className="section-subtitle">أحدث وأفضل الكتب المتوفرة</p>
        </div>
        <div className="featured-grid">
          {Array.isArray(allbook) && allbook.slice(0, 3).map((book) => (
            <div key={book.id} className="featured-card">
              <div className="featured-cover">
                {book.cover_image ? (
                  <img src={getImageUrl(book.cover_image)} alt={`غلاف كتاب ${book.title}`} />
                ) : (
                  <div className="cover-placeholder"> 📚 </div>
                )}
                <span className="featured-badge">جديد</span>
              </div>
              <div className="featured-info">
                <span className="featured-category">{book.category}</span>
                <h3 className="featured-title">{book.title}</h3>
                <p className="featured-author">{book.author}</p>
                <div className="featured-footer">
                  <span className="featured-price">{book.price} ج.م</span>
                  <div className="featured-actions">
                    <button className="btn-add-cart" onClick={() => handleOpenAddModal(book)}>🛒 إضافة</button>
                    <button className="btn-view" onClick={() => window.location.href = `/books/${book.id}`}>عرض</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <button className="btn-view-all" onClick={() => navigate("/books")}>عرض جميع الكتب</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">اختيار دقيق</h3>
            <p className="feature-description">نختار لك أفضل الكتب من مصادر موثوقة</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3 className="feature-title">دفع آمن</h3>
            <p className="feature-description">نوفر لك وسائل دفع آمنة ومتعددة</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3 className="feature-title">شحن سريع</h3>
            <p className="feature-description">توصيل سريع لجميع أنحاء الجمهورية</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3 className="feature-title">استرجاع سهل</h3>
            <p className="feature-description">سياسة استرجاع مرنة خلال 14 يوم</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">هل أنت مستعد لبدء رحلتك مع القراءة؟</h2>
          <p className="cta-subtitle">انضم إلى آلاف القراء واستمتع بأفضل الكتب</p>
          <button className="btn-cta" onClick={() => navigate("/books")}>ابدأ الآن</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">📚 متجر الكتب</h3>
            <p className="footer-text">وجهتك المثالية لأفضل الكتب العربية والعالمية</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">روابط سريعة</h4>
            <ul className="footer-links">
              <li><a href="#about">من نحن</a></li>
              <li><a href="#books">الكتب</a></li>
              <li><a href="#contact">اتصل بنا</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">خدمة العملاء</h4>
            <ul className="footer-links">
              <li><a href="#faq">الأسئلة الشائعة</a></li>
              <li><a href="#shipping">الشحن والتوصيل</a></li>
              <li><a href="#returns">سياسة الاسترجاع</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">تابعنا</h4>
            <div className="social-links">
              <a href="#facebook" className="social-icon">📘</a>
              <a href="#twitter" className="social-icon">🐦</a>
              <a href="#instagram" className="social-icon">📷</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 متجر الكتب. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Shopping Cart Modal */}
      <ShoppingCart />

      {/* Add to Cart Modal */}
      <AddToCartModal 
        isOpen={showAddModal}
        book={selectedBook}
        onClose={handleCloseAddModal}
      />
    </div>
  );
};

export default Home;
