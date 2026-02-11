import React from 'react';
import Input from '../components/Input';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { notify } from '../utils/notify';
import { ToastContainer } from 'react-toastify';
import { createBook } from '../Redux/Actions/BookAction';
import { useNavigate } from 'react-router-dom';

const BookCreate = () => {

  const navigate = useNavigate();

 const [booktitle, setBookTitle] = useState('');
 const [author, setAuthor] = useState('');
 const [isbn, setIsbn] = useState('');
 const [publishYear, setPublishYear] = useState('');
 const [publishercorporation, setPublisherCorporation] = useState('');
 const [pages, setPages] = useState('');
 const [category, setCategory] = useState('');
 const [price, setPrice] = useState('');
 const [stock, setStock] = useState('0');
 const [status, setStatus] = useState('available');
 const [coverImage, setCoverImage] = useState(null);
 const [description, setDescription] = useState('');
 const [hasSubmitted, setHasSubmitted] = useState(false);

 const normalizeDigits = (value) => {
  if (!value) return '';
  const easternArabic = '٠١٢٣٤٥٦٧٨٩';
  const persianArabic = '۰۱۲۳۴۵۶۷۸۹';
  return value
    .toString()
    .split('')
    .map((ch) => {
      const eaIndex = easternArabic.indexOf(ch);
      if (eaIndex > -1) return eaIndex.toString();
      const paIndex = persianArabic.indexOf(ch);
      if (paIndex > -1) return paIndex.toString();
      return ch;
    })
    .join('');
 };

 const getMissingFields = () => {
  const required = [
    { value: booktitle.trim(), label: 'عنوان الكتاب' },
    { value: author.trim(), label: 'المؤلف' },
    { value: isbn.trim(), label: 'ISBN' },
    { value: category.trim(), label: 'التصنيف' },
    { value: normalizeDigits(price), label: 'السعر' },
    { value: normalizeDigits(stock), label: 'الكمية بالمخزون' },
  ];
  return required.filter((f) => f.value === '').map((f) => f.label);
 };

 const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = getMissingFields();
    if (missingFields.length) {
      notify(`أكمل الحقول: ${missingFields.join('، ')}`, 'error');
      return;
    }

    const priceValue = Number(normalizeDigits(price));
    const stockValue = Number(normalizeDigits(stock));

    if (Number.isNaN(priceValue) || Number.isNaN(stockValue)) {
      notify('السعر والمخزون يجب أن يكونا أرقامًا', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', booktitle);
    formData.append('author', author);
    formData.append('isbn', isbn);
    formData.append('category', category);
    formData.append('price', priceValue);
    formData.append('stock', stockValue);
    formData.append('status', status);

    if (publishYear) {
      formData.append('publish_year', normalizeDigits(publishYear));
    }

    if (publishercorporation) {
      formData.append('publisher', publishercorporation);
    }

    if (pages) {
      formData.append('pages', pages);
    }

    if (description) {
      formData.append('description', description);
    }

    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    setHasSubmitted(true);
    await dispatch(createBook(formData));
  };

  const book = useSelector(state => state.allBooks?.book)
  const loading = useSelector(state => state.allBooks?.loading);

    useEffect(() => {
        if (!hasSubmitted) {
          return;
        }

        if (loading === false) {
           // setCatID(0)
            setBookTitle('')
            setAuthor('')
            setIsbn('')
            setPublisherCorporation('')
            setPages('')
            setPublishYear('')
            setCategory('')
            setPrice('')
            setStock('0')
            setStatus('available')
            setCoverImage(null)
            setDescription('')
            // setTimeout(() => setLoading(true), 1500)

            if (book && typeof book === 'object' && 'success' in book) {
              if (book.success) {
                notify(book.message || "تم الاضافة بنجاح", "success")
                setTimeout(() => {
                  navigate('/books');
                }, 1500);
              } else {
                notify(book.message || "هناك مشكله", "error")
              }
            }
        }
        }, [loading, book, hasSubmitted, navigate])

  const handleCancel = () => {
    console.log('إلغاء الإضافة');
    navigate(-1); // العودة للصفحة السابقة
  };

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <div className="header-icon">📚</div>
          <h1 className="form-title">إضافة كتاب جديد</h1>
          <p className="form-subtitle">أدخل معلومات الكتاب لإضافته إلى المتجر</p>
        </div>

        <form className="book-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-section">
            <h3 className="section-title">المعلومات الأساسية</h3>
            
            <div className="form-row">
              <Input
                label="عنوان الكتاب *"
                type="text"
                placeholder="أدخل عنوان الكتاب"
                name="title"
                id="title"
                value={booktitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <Input
                label="المؤلف *"
                type="text"
                placeholder="اسم المؤلف"
                name="author"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
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
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>
              <div className="form-col">
                <Input
                  label="سنة النشر *"
                  type="number"
                  placeholder="2024"
                  name="publishYear"
                  id="publishYear"
                  value={publishYear}
                  onChange={(e) => setPublishYear(e.target.value)}
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
                value={publishercorporation}
                onChange={(e) => setPublisherCorporation(e.target.value)}
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
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                />
              </div>
              <div className="form-col">
                <div className="input-container">
                  <label htmlFor="category" className="input-label">التصنيف *</label>
                  <select
                    id="category"
                    name="category"
                    className="input-field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-col">
                <div className="input-container">
                  <label htmlFor="availability" className="input-label">حالة التوفر *</label>
                  <select
                    id="availability"
                    name="availability"
                    className="input-field"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="available">متوفر</option>
                    <option value="out_of_stock">نفذ</option>
                    <option value="coming_soon">قريبا</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <Input
                label="الكمية بالمخزون *"
                type="number"
                placeholder="0"
                name="stock"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="form-row">
              <Input
                label="صورة الغلاف"
                type="file"
                name="coverImage"
                id="coverImage"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              إلغاء
            </button>
            <button type="submit" className="btn-submit" >
              إضافة الكتاب
            </button>

          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookCreate;
