import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BookCard from '../components/BookCard';
import Table from '../components/Table';
import Modal from '../components/Modal';

import { useDispatch, useSelector } from 'react-redux';
import {getAllBooks, deleteBook} from '../Redux/Actions/BookAction';
import allBooks from '../Redux/Reducers/rootReducer';
import { toast } from 'react-toastify';
import { openCartModal } from '../Redux/Actions/modalAction';
import { getCartItems } from '../Redux/Actions/cartAction';
import ShoppingCart from '../components/ShoppingCart';
import AddToCartModal from '../components/AddToCartModal';




const BookList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  // بيانات تجريبية للكتب - يمكنك استبدالها بـ API call

const dispatch = useDispatch();

// جلب البيانات من Redux Store (بدون pagination)
const allbook = useSelector(state => state.allBooks?.book) || [];
const { totalItems } = useSelector(state => state.cart);

useEffect(() => {
  const fetchBooks = async () => {
    setLoading(true);
    await dispatch(getAllBooks());
    if (user && user.role === 'user') {
      await dispatch(getCartItems());
    }
    setLoading(false);
  };
  
  fetchBooks();
}, [dispatch, user]);

// تتبع البيانات بعد التحديث
useEffect(() => {
  console.log('📚 عدد الكتب:', allbook.length);
  console.log('📚 البيانات:', allbook);
}, [allbook]);
  // const sampleBooks = [
  //   {
  //     id: 1,
  //     title: 'البؤساء',
  //     author: 'فيكتور هيجو',
  //     isbn: '978-1234567890',
  //     price: '150',
  //     publisher: 'دار الآداب',
  //     publishYear: '2020',
  //     pages: '1200',
  //     category: 'روايات',
  //     description: 'رواية كلاسيكية خالدة',
  //     coverImage: '',
  //     availability: 'متوفر'
  //   },
  //   {
  //     id: 2,
  //     title: 'مختصر تاريخ الزمن',
  //     author: 'ستيفن هوكينج',
  //     isbn: '978-9876543210',
  //     price: '200',
  //     publisher: 'دار العلوم',
  //     publishYear: '2019',
  //     pages: '300',
  //     category: 'علمية',
  //     description: 'كتاب في الفيزياء النظرية',
  //     coverImage: '',
  //     availability: 'متوفر'
  //   },
  //   {
  //     id: 3,
  //     title: 'الحرب والسلام',
  //     author: 'ليو تولستوي',
  //     isbn: '978-5555555555',
  //     price: '180',
  //     publisher: 'مكتبة الشروق',
  //     publishYear: '2021',
  //     pages: '1500',
  //     category: 'روايات',
  //     description: 'ملحمة أدبية عظيمة',
  //     coverImage: '',
  //     availability: 'نفذ'
  //   },
  //   {
  //     id: 4,
  //     title: 'تاريخ الحضارات',
  //     author: 'ويل ديورانت',
  //     isbn: '978-7777777777',
  //     price: '250',
  //     publisher: 'دار المعرفة',
  //     publishYear: '2018',
  //     pages: '800',
  //     category: 'تاريخية',
  //     description: 'موسوعة تاريخية شاملة',
  //     coverImage: '',
  //     availability: 'متوفر'
  //   }
  // ];

  const tableColumns = ['#', 'العنوان', 'المؤلف', 'الفئة', 'السعر', 'الحالة'];
  
  const categories = ['الكل', 'روايات', 'علمية', 'تاريخية', 'دينية', 'أطفال', 'تنمية بشرية'];

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBooks = allbook.filter((book) => {
    const matchesCategory =
      selectedCategory === 'الكل' || book.category === selectedCategory;

    if (!normalizedSearch) {
      return matchesCategory;
    }

    const title = (book.title || '').toLowerCase();
    const author = (book.author || '').toLowerCase();
    const isbn = (book.isbn || '').toLowerCase();
    const publisher = (book.publisher || '').toLowerCase();

    const matchesSearch =
      title.includes(normalizedSearch) ||
      author.includes(normalizedSearch) ||
      isbn.includes(normalizedSearch) ||
      publisher.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  const handleView = (book) => {
     navigate(`${book.id}`, { state: book });

  };

  const handleEdit = (book) => {
    // console.log('تعديل الكتاب:', book);
    navigate(`/books/edit/${book.id}`, { state: book });
  };


  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    
    setLoading(true);
    try {
      await dispatch(deleteBook(bookToDelete.id));
      toast.success('تم حذف الكتاب بنجاح');
      await dispatch(getAllBooks());
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الكتاب');
      console.error('Error deleting book:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  const handleAdd = () => {
    navigate('/books/create');
  };

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

  const isAdmin = user && user.role === 'admin';

  if (loading) {
    return <div className="bookstore-container"><div className="loading">جاري التحميل...</div></div>;
  }

  return (
    <div className="bookstore-container">
      {/* Cart Button for regular users */}
      {!isAdmin && (
        <button className="floating-cart-btn" onClick={handleOpenCart}>
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      )}

      <div className="bookstore-header">
        <div className="header-top">
          <div className="store-branding">
            <h1 className="store-title">📚 متجر الكتب</h1>
            <p className="store-subtitle">مكتبتك الإلكترونية المتكاملة</p>
          </div>
          {isAdmin && (
            <div className="header-actions">
              <button className="add-book-btn" onClick={handleAdd}>
                <span className="add-book-icon">＋</span>
                <span className="add-book-text">إضافة كتاب جديد</span>
              </button>
            </div>
          )}
        </div>

        <div className="header-filters">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="ابحث عن كتاب، مؤلف، أو ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <select 
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="عرض شبكي"
            >
              ⊞
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="عرض جدول"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className="books-stats">
        <div className="stat-card">
          <div className="stat-number">{filteredBooks.length}</div>
          <div className="stat-label">إجمالي الكتب</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredBooks.filter(b => b.status === 'available').length}</div>
          <div className="stat-label">كتب متوفرة</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(filteredBooks.map(b => b.category)).size}</div>
          <div className="stat-label">التصنيفات</div>
        </div>
      </div>

      <div className="books-content">
        {viewMode === 'grid' ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onView={() => handleView(book)}
                onEdit={isAdmin ? () => handleEdit(book) : undefined}
                onDelete={isAdmin ? () => handleDelete(book) : undefined}
                onAddToCart={!isAdmin ? () => handleOpenAddModal(book) : undefined}
                showAdminButtons={isAdmin}
              />
            ))}
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={filteredBooks?.map(B => ({
              _raw: B,
              id: B.id,
              title: B.title,
              author: B.author,
              category: B.category,
              price: B.price + ' ج.م',
              availability: B.status
            })) || console.log('No data')}
            onView={handleView}
            onEdit={isAdmin ? handleEdit : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
            onAddToCart={!isAdmin ? handleOpenAddModal : undefined}
          />
        )}
      </div>

      {isAdmin && (
        <Modal
          isOpen={showDeleteModal}
          title="⚠️ تأكيد حذف الكتاب"
          message={`هل أنت متأكد من حذف الكتاب "${bookToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          icon="🗑️"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Shopping Cart Modal */}
      {!isAdmin && <ShoppingCart />}

      {/* Add to Cart Modal */}
      {!isAdmin && (
        <AddToCartModal 
          isOpen={showAddModal}
          book={selectedBook}
          onClose={handleCloseAddModal}
        />
      )}
    </div>
  );
};

export default BookList;
