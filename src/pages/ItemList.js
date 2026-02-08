import React, { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';


const ItemList = () => {
  // بيانات تجريبية - يمكنك استبدالها بـ API call
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  const sampleData = [
    { id: 1, title: 'عنصر 1', description: 'وصف العنصر الأول', category: 'الفئة أ' },
    { id: 2, title: 'عنصر 2', description: 'وصف العنصر الثاني', category: 'الفئة ب' },
    { id: 3, title: 'عنصر 3', description: 'وصف العنصر الثالث', category: 'الفئة أ' },
  ];

  const tableColumns = ['الرقم', 'العنوان', 'الوصف', 'الفئة'];
  
  const handleView = (item) => {
    console.log('عرض:', item);
    // هنا يمكنك إضافة logic للانتقال لصفحة التفاصيل
  };

  const handleEdit = (item) => {
    console.log('تعديل:', item);
    // هنا يمكنك إضافة logic للانتقال لصفحة التعديل
  };

  const handleDelete = (item) => {
    console.log('حذف:', item);
    // هنا يمكنك إضافة logic لحذف العنصر
  };

  const handleAdd = () => {
    console.log('إضافة عنصر جديد');
    // هنا يمكنك إضافة logic للانتقال لصفحة الإضافة
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">قائمة العناصر</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <span>شبكة</span>
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <span>جدول</span>
            </button>
          </div>
          <button className="add-btn" onClick={handleAdd}>
            + إضافة جديد
          </button>
        </div>
      </div>

      <div className="page-content">
        {viewMode === 'grid' ? (
          <div className="grid-view">
            {sampleData.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                description={item.description}
                onView={() => handleView(item)}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={sampleData}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ItemList;
