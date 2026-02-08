import React, { useState } from 'react';
import Modal from '../components/Modal';


const BookDetails = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // بيانات تجريبية - يمكنك استبدالها بـ data من API
  const bookData = {
    id: 1,
    title: 'البؤساء',
    author: 'فيكتور هيجو',
    isbn: '978-1234567890',
    price: '150',
    publisher: 'دار الآداب',
    publishYear: '2020',
    pages: '1200',
    category: 'روايات',
    description: 'رواية كلاسيكية خالدة تحكي قصة جان فالجان، رجل سُجن لمدة 19 عامًا بسبب سرقة رغيف خبز. تتناول الرواية موضوعات العدالة الاجتماعية، والفقر، والمعاناة الإنسانية، والخلاص من خلال الحب والتضحية. تعتبر من أعظم الروايات في تاريخ الأدب العالمي.',
    coverImage: '',
    availability: 'متوفر',
    createdAt: '2024-01-15',
    updatedAt: '2026-01-18'
  };

  const handleEdit = () => {
    console.log('الانتقال لصفحة التعديل');
    // هنا يمكنك إضافة logic للانتقال لصفحة التعديل
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('تم حذف الكتاب');
    setShowDeleteModal(false);
    // هنا يمكنك إضافة logic لحذف الكتاب
  };

  const handleBack = () => {
    console.log('العودة للقائمة');
    // هنا يمكنك إضافة logic للعودة للصفحة السابقة
  };

  return (
    <div className="page-container">
      <div className="details-wrapper">
        <div className="details-header">
          <button className="back-btn" onClick={handleBack}>
            ← العودة إلى المتجر
          </button>
          <div className="header-actions">
            <button className="edit-action-btn" onClick={handleEdit}>
              ✏️ تعديل
            </button>
            <button className="delete-action-btn" onClick={handleDelete}>
              🗑️ حذف
            </button>
          </div>
        </div>

        <div className="book-showcase">
          <div className="book-cover-section">
            {bookData.coverImage ? (
              <img src={bookData.coverImage} alt={bookData.title} className="book-cover-large" />
            ) : (
              <div className="book-cover-placeholder">
                <span className="placeholder-icon">📚</span>
                <p className="placeholder-text">غلاف الكتاب</p>
              </div>
            )}
            <span className={`availability-status ${bookData.availability === 'متوفر' ? 'available' : 'unavailable'}`}>
              {bookData.availability === 'متوفر' ? '✓ متوفر' : '✕ نفذ من المخزون'}
            </span>
          </div>

          <div className="book-info-section">
            <div className="book-header">
              <h1 className="book-title-large">{bookData.title}</h1>
              <div className="book-category-badge">{bookData.category}</div>
            </div>

            <div className="book-author-info">
              <span className="author-label">المؤلف:</span>
              <span className="author-name">{bookData.author}</span>
            </div>

            <div className="book-price-section">
              <span className="price-label">السعر:</span>
              <span className="price-value">{bookData.price} ج.م</span>
            </div>

            <div className="book-description-preview">
              <h3 className="description-title">نبذة عن الكتاب</h3>
              <p className="description-text">{bookData.description}</p>
            </div>
          </div>
        </div>

        <div className="book-detailed-info">
          <h2 className="info-section-title">📖 التفاصيل الكاملة</h2>
          
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📘</div>
              <div className="info-content">
                <span className="info-label">رقم ISBN</span>
                <span className="info-value">{bookData.isbn}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🏢</div>
              <div className="info-content">
                <span className="info-label">دار النشر</span>
                <span className="info-value">{bookData.publisher}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📅</div>
              <div className="info-content">
                <span className="info-label">سنة النشر</span>
                <span className="info-value">{bookData.publishYear}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📄</div>
              <div className="info-content">
                <span className="info-label">عدد الصفحات</span>
                <span className="info-value">{bookData.pages} صفحة</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🆔</div>
              <div className="info-content">
                <span className="info-label">رقم المنتج</span>
                <span className="info-value">#{bookData.id}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🔄</div>
              <div className="info-content">
                <span className="info-label">آخر تحديث</span>
                <span className="info-value">{bookData.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        title="⚠️ تأكيد حذف الكتاب"
        message={`هل أنت متأكد من حذف الكتاب "${bookData.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default BookDetails;
