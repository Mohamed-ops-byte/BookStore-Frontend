import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';


const ItemEdit = () => {
  // بيانات تجريبية - يمكنك استبدالها بـ data من API
  const currentItem = {
    id: 1,
    title: 'عنصر للتعديل',
    description: 'وصف العنصر الحالي',
    category: 'category1',
    price: '99.99',
    status: 'active',
    notes: 'ملاحظات العنصر الحالي'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('تحديث العنصر');
    // هنا يمكنك إضافة logic لتحديث البيانات
  };

  const handleCancel = () => {
    console.log('إلغاء التعديل');
    // هنا يمكنك إضافة logic للعودة للصفحة السابقة
  };

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1 className="form-title">تعديل العنصر</h1>
          <p className="form-subtitle">قم بتعديل البيانات أدناه</p>
        </div>

        <form className="item-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              label="العنوان *"
              type="text"
              placeholder="أدخل العنوان"
              name="title"
              id="title"
            />
          </div>

          <div className="form-row">
            <Input
              label="الوصف *"
              type="text"
              placeholder="أدخل الوصف"
              name="description"
              id="description"
            />
          </div>

          <div className="form-row">
            <div className="input-container">
              <label htmlFor="category" className="input-label">الفئة *</label>
              <select id="category" name="category" className="input-field" defaultValue={currentItem.category}>
                <option value="">اختر الفئة</option>
                <option value="category1">الفئة أ</option>
                <option value="category2">الفئة ب</option>
                <option value="category3">الفئة ج</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <Input
              label="السعر"
              type="number"
              placeholder="0.00"
              name="price"
              id="price"
            />
          </div>

          <div className="form-row">
            <div className="input-container">
              <label htmlFor="status" className="input-label">الحالة</label>
              <select id="status" name="status" className="input-field" defaultValue={currentItem.status}>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="input-container">
              <label htmlFor="notes" className="input-label">ملاحظات</label>
              <textarea 
                id="notes" 
                name="notes" 
                className="input-field textarea-field"
                placeholder="أدخل ملاحظات إضافية..."
                rows="4"
                defaultValue={currentItem.notes}
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              إلغاء
            </button>
            <button type="submit" className="btn-submit">
              تحديث
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemEdit;
