import React, { useState, useEffect } from 'react';

import { Navigate, useLocation, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneBook, getAllBooks } from '../Redux/Actions/BookAction';
import { addToCart, getCartItems } from '../Redux/Actions/cartAction';
import { openCartModal } from '../Redux/Actions/modalAction';
import ShoppingCart from '../components/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../Api/favoriteOrderService';
import { toast } from 'react-toastify';

const BookView = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // جلب البيانات من Redux store
  const book = useSelector(state => state.allBooks?.oneBook) || location.state?.book;
  const loading = useSelector(state => state.allBooks?.loading);
  const relatedBooks = useSelector(state => state.allBooks?.book) || [];
  const { totalItems } = useSelector(state => state.cart);

  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `http://127.0.0.1:8000/storage/${coverImage}`;
  };

  useEffect(() => {
    // إذا لم تكن البيانات موجودة في state، اجلبها من API
    if (id && !location.state?.book) {
      dispatch(getOneBook(id));
      dispatch(getAllBooks());
    }
  }, [dispatch, id, location.state]);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  // Check favorite status from API
  useEffect(() => {
    if (!book?.id) return;
    
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsFavorite(false);
          return;
        }
        
        const response = await favoriteService.isFavorited(book.id);
        if (response.success) {
          setIsFavorite(response.isFavorited);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsFavorite(false);
      }
    };
    
    checkFavorite();
  }, [book?.id]);

  // console.log('Book data:', book);

  // بيانات تجريبية للكتاب - يمكنك استبدالها بـ API call
  // const book = {
  //   id: 1,
  //   title: 'البؤساء',
  //   author: 'فيكتور هيجو',
  //   originalTitle: 'Les Misérables',
  //   isbn: '978-1234567890',
  //   price: 150,
  //   originalPrice: 200,
  //   discount: 25,
  //   publisher: 'دار الآداب',
  //   publishYear: 2020,
  //   pages: 1200,
  //   category: 'روايات',
  //   language: 'عربي',
  //   rating: 4.8,
  //   reviewsCount: 245,
  //   availability: 'متوفر',
  //   stock: 15,
  //   coverImage: '',
  //   description: 'رواية كلاسيكية خالدة تحكي قصة جان فالجان، رجل سُجن لمدة 19 عامًا بسبب سرقة رغيف خبز. تتناول الرواية موضوعات العدالة الاجتماعية، والفقر، والمعاناة الإنسانية، والخلاص من خلال الحب والتضحية. تعتبر من أعظم الروايات في تاريخ الأدب العالمي وتعكس المجتمع الفرنسي في القرن التاسع عشر.',
  //   features: [
  //     'ترجمة احترافية ودقيقة',
  //     'غلاف فاخر ومتين',
  //     'طباعة واضحة ومريحة للعين',
  //     'ورق عالي الجودة'
  //   ]
  // };

  // const relatedBooks = [
  //   { id: 2, title: 'الحرب والسلام', author: 'ليو تولستوي', price: '180', category: 'روايات' },
  //   { id: 3, title: 'الجريمة والعقاب', author: 'دوستويفسكي', price: '165', category: 'روايات' },
  //   { id: 4, title: 'مدام بوفاري', author: 'غوستاف فلوبير', price: '140', category: 'روايات' },
  // ];

  const reviews = [
    { id: 1, name: 'أحمد محمد', rating: 5, date: '2026-01-10', comment: 'رواية رائعة ومؤثرة جداً، أنصح الجميع بقراءتها' },
    { id: 2, name: 'فاطمة علي', rating: 4, date: '2026-01-08', comment: 'ترجمة ممتازة وطباعة جيدة' },
    { id: 3, name: 'محمود سعيد', rating: 5, date: '2026-01-05', comment: 'من أفضل الروايات التي قرأتها' },
  ];

  const handleQuantityChange = (change) => {
    const max = book?.stock || 99;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = async () => {
    if (!book?.id) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    try {
      const response = await favoriteService.toggleFavorite(book.id);
      if (response.success) {
        setIsFavorite(response.isFavorited);
        toast.success(response.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      const errorMessage = error?.message || 'حدث خطأ في تحديث المفضلة';
      toast.error(errorMessage);
    }
  };

  const handleAddToCart = async () => {
    if (!book) return;
    await dispatch(addToCart(book, quantity));
    await dispatch(getCartItems());
    dispatch(openCartModal());
  };

  const handleOpenCart = () => {
    dispatch(getCartItems());
    dispatch(openCartModal());
  };

  const handleBuyNow = () => {
    if (!book) return;
    // الذهاب مباشرة إلى checkout لشراء هذا الكتاب فقط
    navigate('/checkout', { 
      state: { 
        singleBook: true,
        book: book, 
        quantity: quantity 
      } 
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="book-view-container">
      <button className="floating-cart-btn" onClick={handleOpenCart}>
        🛒
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>
      {loading ? (
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
          جاري التحميل...
        </div>
      ) : !book ? (
        <div className="error-message" style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#e74c3c' }}>
          لم يتم العثور على الكتاب
        </div>
      ) : (
        <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to='/'>الرئيسية</Link>
        <span className="separator">›</span>
        <Link to="/books">الكتب</Link>
        <span className="separator">›</span>
        <Link to={`/categories/${book.category}`}>{book.category}</Link>
        <span className="separator">›</span>
        <span className="current">{book.title}</span>
      </div>

      {/* Main Content */}
      <div className="book-view-content">
        {/* Left: Image */}
        <div className="book-image-section">
          <div className="main-image">
            {book.cover_image ? (
              <img src={getImageUrl(book.cover_image)} alt={book.title} />
            ) : (
              <div className="image-placeholder">
                <span className="placeholder-icon">📚</span>
              </div>
            )}
            {book.discount > 0 && (
              <span className="discount-badge">-{book.discount}%</span>
            )}
          </div>
          <div className="image-actions">
            <button 
              className={`action-icon ${isFavorite ? 'active' : ''}`}
              title={isFavorite ? 'حذف من المفضلة' : 'إضافة للمفضلة'}
              onClick={toggleFavorite}
            >
              <span>❤️</span>
            </button>
            <button className="action-icon" title="مشاركة">
              <span>🔗</span>
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="book-info-section">
          <div className="book-header">
            <span className="category-tag">{book.category}</span>
            <h1 className="book-title">{book.title}</h1>
            {book.originalTitle && (
              <p className="original-title">{book.originalTitle}</p>
            )}
            <div className="author-info">
              <span className="by">تأليف:</span>
              <a href="#author" className="author-link">{book.author}</a>
            </div>
          </div>

          <div className="rating-section">
            <div className="stars">
              {renderStars(Math.round(book.rating))}
            </div>
            <span className="rating-number">{book.rating}</span>
            <span className="reviews-count">({book.reviewsCount} تقييم)</span>
          </div>

          <div className="price-section">
            {book.discount > 0 && (
              <span className="original-price">{book.originalPrice} ج.م</span>
            )}
            <span className="current-price">{book.price} ج.م</span>
            {book.discount > 0 && (
              <span className="save-amount">وفر {book.originalPrice - book.price} ج.م</span>
            )}
          </div>

          <div className="availability-section">
            <div className="availability-info">
              <span className={`status ${book.availability === 'متوفر' ? 'available' : 'unavailable'}`}>
                {book.availability === 'متوفر' ? '✓' : '✕'} {book.availability}
              </span>
              {book.availability === 'متوفر' && (
                <span className="stock-info">متوفر {book.stock} نسخة</span>
              )}
            </div>
          </div>

          <div className="book-meta">
            <div className="meta-item">
              <span className="meta-label">الناشر:</span>
              <span className="meta-value">{book.publisher}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">سنة النشر:</span>
              <span className="meta-value">{book.publishYear}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">عدد الصفحات:</span>
              <span className="meta-value">{book.pages} صفحة</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">اللغة:</span>
              <span className="meta-value">{book.language}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">ISBN:</span>
              <span className="meta-value">{book.isbn}</span>
            </div>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <button 
                className="qty-btn" 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input 
                type="number" 
                className="qty-input" 
                value={quantity}
                readOnly
              />
              <button 
                className="qty-btn" 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= book.stock}
              >
                +
              </button>
            </div>
            <button className="btn-add-cart" onClick={handleAddToCart}>
              <span className="cart-icon">🛒</span>
              إضافة إلى السلة
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              اشتر الآن
            </button>
          </div>

          <div className="features-list">
            {book.features && book.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="check-icon">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${selectedTab === 'description' ? 'active' : ''}`}
            onClick={() => setSelectedTab('description')}
          >
            الوصف
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setSelectedTab('reviews')}
          >
            التقييمات ({book.reviewsCount})
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'info' ? 'active' : ''}`}
            onClick={() => setSelectedTab('info')}
          >
            معلومات إضافية
          </button>
        </div>

        <div className="tabs-content">
          {selectedTab === 'description' && (
            <div className="tab-panel">
              <h3>عن الكتاب</h3>
              <p className="description-text">{book.description}</p>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="tab-panel">
              <div className="reviews-summary">
                <div className="summary-rating">
                  <div className="big-rating">{book.rating}</div>
                  <div className="stars-large">
                    {renderStars(Math.round(book.rating))}
                  </div>
                  <div className="total-reviews">{book.reviewsCount} تقييم</div>
                </div>
              </div>
              <div className="reviews-list">
                {reviews && reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.name}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-stars">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
              <button className="btn-write-review">اكتب تقييمك</button>
            </div>
          )}

          {selectedTab === 'info' && (
            <div className="tab-panel">
              <table className="info-table">
                <tbody>
                  <tr>
                    <th>العنوان</th>
                    <td>{book.title}</td>
                  </tr>
                  <tr>
                    <th>المؤلف</th>
                    <td>{book.author}</td>
                  </tr>
                  <tr>
                    <th>الناشر</th>
                    <td>{book.publisher}</td>
                  </tr>
                  <tr>
                    <th>سنة النشر</th>
                    <td>{book.publishYear}</td>
                  </tr>
                  <tr>
                    <th>عدد الصفحات</th>
                    <td>{book.pages} صفحة</td>
                  </tr>
                  <tr>
                    <th>اللغة</th>
                    <td>{book.language}</td>
                  </tr>
                  <tr>
                    <th>التصنيف</th>
                    <td>{book.category}</td>
                  </tr>
                  <tr>
                    <th>ISBN</th>
                    <td>{book.isbn}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Related Books */}
      <div className="related-section">
        <h2 className="related-title">كتب ذات صلة</h2>
        <div className="related-grid">
          {relatedBooks.slice(1,5).map((relatedBook) => (
            <div key={relatedBook.id} className="related-card">
              <div className="related-cover">
                {relatedBook.cover_image ? (
                  <img src={relatedBook.cover_image} alt={relatedBook.title} />
                ) : (<div className="cover-placeholder">📚</div>
                )}
              </div>
              <div className="related-info">
                <span className="related-category">{relatedBook.category}</span>
                <h4 className="related-book-title">{relatedBook.title}</h4>
                <p className="related-author">{relatedBook.author}</p>
                <div className="related-footer">
                  <span className="related-price">{relatedBook.price} ج.م</span>
                  <button className="btn-quick-view" onClick={() => {
                  window.location.href = `/books/${relatedBook.id}`;}}>عرض سريع</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
      <ShoppingCart />
    </div>
  );
};

export default BookView;
