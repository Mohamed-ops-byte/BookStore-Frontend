import React, { useState } from 'react';
import Modal from '../components/Modal';


const ItemDetails = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // بيانات تجريبية - يمكنك استبدالها بـ data من API
  const itemData = {
    id: 1,
    title: 'عنصر تفصيلي',
    description: 'هذا وصف تفصيلي للعنصر الذي تم اختياره',
    category: 'الفئة أ',
    price: '99.99',
    status: 'نشط',
    notes: 'هذه ملاحظات إضافية عن العنصر',
    createdAt: '2026-01-15',
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
    console.log('تم حذف العنصر');
    setShowDeleteModal(false);
    // هنا يمكنك إضافة logic لحذف العنصر
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
            ← العودة
          </button>
          <div className="header-actions">
            <button className="edit-action-btn" onClick={handleEdit}>
              تعديل
            </button>
            <button className="delete-action-btn" onClick={handleDelete}>
              حذف
            </button>
          </div>
        </div>

        <div className="details-content">
          <div className="details-title-section">
            <h1 className="details-title">{itemData.title}</h1>
            <span className={`status-badge ${itemData.status === 'نشط' ? 'active' : 'inactive'}`}>
              {itemData.status}
            </span>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">الرقم التعريفي:</span>
              <span className="detail-value">{itemData.id}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">الفئة:</span>
              <span className="detail-value">{itemData.category}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">السعر:</span>
              <span className="detail-value">{itemData.price} ج.م</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">تاريخ الإنشاء:</span>
              <span className="detail-value">{itemData.createdAt}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">تاريخ التحديث:</span>
              <span className="detail-value">{itemData.updatedAt}</span>
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-title">الوصف</h3>
            <p className="section-content">{itemData.description}</p>
          </div>

          {itemData.notes && (
            <div className="details-section">
              <h3 className="section-title">ملاحظات</h3>
              <p className="section-content">{itemData.notes}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ItemDetails;
