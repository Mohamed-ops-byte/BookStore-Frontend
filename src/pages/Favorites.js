import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, getCartItems } from '../Redux/Actions/cartAction';
import { openCartModal } from '../Redux/Actions/modalAction';
import ShoppingCart from '../components/ShoppingCart';
import { favoriteService } from '../Api/favoriteOrderService';
import { toast } from 'react-toastify';

const Favorites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('الكل');

  const categories = ['الكل', ...Array.from(new Set(favorites.map((f) => f.category))).filter(Boolean)];

  // Fetch favorites from API on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('يجب تسجيل الدخول أولاً');
          navigate('/login');
          return;
        }

        setLoading(true);
        const response = await favoriteService.getUserFavorites(1, 100);
        
        if (response.success && response.data) {
          setFavorites(response.data);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('حدث خطأ في تحميل المفضلات');
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const removeFavorite = async (id) => {
    try {
      const response = await favoriteService.removeFromFavorites(id);
      
      if (response.success) {
        setFavorites(favorites.filter(item => item.id !== id));
        toast.success('تم إزالة الكتاب من المفضلات');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('حدث خطأ في إزالة المفضلة');
    }
  };

  const handleAddToCart = async (item) => {
    await dispatch(addToCart(item, 1));
    await dispatch(getCartItems());
    dispatch(openCartModal());
  };

  const filteredFavorites = filterCategory === 'الكل'
    ? favorites
    : favorites.filter(item => item.category === filterCategory);

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <div>
          <p className="eyebrow">المفضلات</p>
          <h1>❤️ الكتب المفضلة</h1>
          <p className="subtitle">{sortedFavorites.length} كتب في قائمة المفضلات</p>
        </div>
        <button className="back-btn" onClick={() => navigate('/books')}>
          العودة للتسوق ←
        </button>
      </header>

      <section className="favorites-controls">
        <div className="filter-group">
          <label>الفئة</label>
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-group">
          <label>ترتيب حسب</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">الأحدث</option>
            <option value="price-low">السعر: من الأقل للأعلى</option>
            <option value="price-high">السعر: من الأعلى للأقل</option>
            <option value="rating">التقييم</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
          جار تحميل المفضلات...
        </div>
      ) : sortedFavorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">💔</div>
          <h2>لا توجد عناصر مفضلة</h2>
          <p>ابدأ بإضافة كتبك المفضلة من المتجر</p>
          <button className="cta-btn" onClick={() => navigate('/books')}>
            تصفح الكتب
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {sortedFavorites.map(item => (
            <div key={item.id} className="favorite-card">
              <div className="card-header">
                <div className="item-image">
                  {item.cover_image ? (
                    <img src={`http://127.0.0.1:8000${item.cover_image}`} alt={item.title} />
                  ) : (
                    <div style={{ background: '#ccc', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      📖
                    </div>
                  )}
                </div>
                <button
                  className="favorite-btn active"
                  onClick={() => removeFavorite(item.id)}
                  title="حذف من المفضلات"
                >
                  ❤️
                </button>
              </div>

              <div className="card-content">
                <span className="category-badge">{item.category}</span>
                <h3 className="item-title">{item.title}</h3>
                <p className="item-author">{item.author}</p>

                <div className="price-section">
                  <p className="price">{item.price} ج.م</p>
                  <span className={`stock-status ${item.status === 'available' ? 'available' : 'unavailable'}`}>
                    {item.status === 'available' ? '✓ متوفر' : '✗ غير متوفر'}
                  </span>
                </div>

                <div className="card-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.status !== 'available'}
                  >
                    🛒 أضف للسلة
                  </button>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/books/${item.id}`)}
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ShoppingCart />
    </div>
  );
};

export default Favorites;
