import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneBook, updateBook } from '../Redux/Actions/BookAction';
import Input from '../components/Input';

import { toast } from 'react-toastify';

const BookEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const oneBook = useSelector(state => {
    const data = state.allBooks?.oneBook;
    // التحقق من البيانات المرجعة من الـ API
    if (data?.data) return data.data;
    return data;
  });
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    publisher: '',
    publishYear: '',
    pages: '',
    category: '',
    description: '',
    availability: 'متوفر'
  });

  const [loading, setLoading] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [isLoadingBook, setIsLoadingBook] = useState(true);

  // جلب بيانات الكتاب عند التحميل
  useEffect(() => {
    if (id) {
      dispatch(getOneBook(id));
    }
  }, [id, dispatch]);

  // تحديث النموذج عند وصول البيانات
  useEffect(() => {
    if (oneBook && Object.keys(oneBook).length > 0) {
      console.log('Book data loaded:', oneBook);
      // استخراج السنة من created_at إذا لم تكن publish_year موجودة
      let publishYear = oneBook?.publish_year || '';
      if (!publishYear && oneBook?.created_at) {
        publishYear = new Date(oneBook.created_at).getFullYear().toString();
      }
      
      setFormData({
        title: oneBook?.title || '',
        author: oneBook?.author || '',
        isbn: oneBook?.isbn || '',
        price: oneBook?.price || '',
        publisher: oneBook?.publisher || '',
        publishYear: publishYear,
        pages: oneBook?.pages || '',
        category: oneBook?.category || '',
        description: oneBook?.description || '',
        availability: oneBook?.status === 'available' ? 'متوفر' : (oneBook?.status === 'out_of_stock' ? 'نفذ' : 'قريبا')
      });
      if (oneBook?.cover_image) {
        setCoverImagePreview(`http://127.0.0.1:8000${oneBook?.cover_image}`);
      }
      setIsLoadingBook(false);
    }
  }, [oneBook]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateFormData = new FormData();
      updateFormData.append('title', formData.title);
      updateFormData.append('author', formData.author);
      updateFormData.append('isbn', formData.isbn);
      updateFormData.append('price', formData.price);
      updateFormData.append('publisher', formData.publisher);
      if (formData.publishYear) {
        updateFormData.append('publish_year', formData.publishYear);
      }
      updateFormData.append('pages', formData.pages);
      updateFormData.append('category', formData.category);
      updateFormData.append('description', formData.description);
      // تحويل الحالة من العربية إلى الإنجليزية
      const statusMap = {
        'متوفر': 'available',
        'نفذ': 'out_of_stock',
        'قريبا': 'coming_soon'
      };
      updateFormData.append('status', statusMap[formData.availability] || 'available');
      updateFormData.append('_method', 'PUT');

      if (coverImageFile) {
        updateFormData.append('cover_image', coverImageFile);
      }

      await dispatch(updateBook(id, updateFormData));
      toast.success('تم تحديث الكتاب بنجاح');
      navigate('/books');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الكتاب');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/books');
  };

  return (
    <div className="page-container">
      {isLoadingBook ? (
        <div className="form-wrapper">
          <div className="loading-message">جاري تحميل بيانات الكتاب...</div>
        </div>
      ) : (
        <div className="form-wrapper">
          <div className="form-header">
            <div className="header-icon">✏️</div>
            <h1 className="form-title">تعديل بيانات الكتاب</h1>
            <p className="form-subtitle">قم بتحديث معلومات الكتاب أدناه</p>
          </div>

          <form className="book-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">المعلومات الأساسية</h3>
            
            <div className="form-row">
              <Input
                label="عنوان الكتاب *"
                type="text"
                placeholder="أدخل عنوان الكتاب"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="المؤلف *"
                type="text"
                placeholder="اسم المؤلف"
                name="author"
                id="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row-group">
              <div className="form-col">
                <Input
                  label="رقم ISBN *"
                  type="text"
                  placeholder="978-1234567890"
                  name="isbn"
                  id="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <Input
                  label="سنة النشر *"
                  type="number"
                  placeholder="2024"
                  name="publishYear"
                  id="publishYear"
                  value={formData.publishYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">معلومات النشر</h3>
            
            <div className="form-row">
              <Input
                label="دار النشر *"
                type="text"
                placeholder="اسم دار النشر"
                name="publisher"
                id="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row-group">
              <div className="form-col">
                <Input
                  label="عدد الصفحات"
                  type="number"
                  placeholder="300"
                  name="pages"
                  id="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-col">
                <div className="input-container">
                  <label htmlFor="category" className="input-label">التصنيف *</label>
                  <select 
                    id="category" 
                    name="category" 
                    className="input-field" 
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">اختر التصنيف</option>
                    <option value="روايات">روايات</option>
                    <option value="علمية">علمية</option>
                    <option value="تاريخية">تاريخية</option>
                    <option value="دينية">دينية</option>
                    <option value="أطفال">أطفال</option>
                    <option value="تنمية بشرية">تنمية بشرية</option>
                    <option value="سياسية">سياسية</option>
                    <option value="فلسفية">فلسفية</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">معلومات البيع</h3>
            
            <div className="form-row-group">
              <div className="form-col">
                <Input
                  label="السعر (ج.م) *"
                  type="number"
                  placeholder="0.00"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <div className="input-container">
                  <label htmlFor="availability" className="input-label">حالة التوفر *</label>
                  <select 
                    id="availability" 
                    name="availability" 
                    className="input-field"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="متوفر">متوفر</option>
                    <option value="نفذ">نفذ</option>
                    <option value="قريبا">قريبا</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-container">
                <label htmlFor="coverImage" className="input-label">صورة الغلاف</label>
                <div className="cover-image-upload">
                  <input 
                    type="file" 
                    id="coverImage" 
                    name="coverImage"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="coverImage" className="upload-btn">
                    📷 اختر صورة جديدة
                  </label>
                  {coverImagePreview && (
                    <div className="image-preview">
                      <img src={coverImagePreview} alt="معاينة الغلاف" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">الوصف</h3>
            
            <div className="form-row">
              <div className="input-container">
                <label htmlFor="description" className="input-label">وصف الكتاب *</label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="input-field textarea-field"
                  placeholder="اكتب وصفاً تفصيلياً عن الكتاب، محتواه، وما يميزه..."
                  rows="5"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel} disabled={loading}>
              إلغاء
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'جاري التحديث...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
};

export default BookEdit;
