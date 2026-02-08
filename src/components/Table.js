import React from 'react';

import { useState } from 'react';

const Table = ({ columns, data, onEdit, onDelete, onView, onAddToCart }) => {

   const [user, setUser] = useState(() => {
     const storedUser = localStorage.getItem('user');
     return storedUser ? JSON.parse(storedUser) : null;
      });

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowData = row && row._raw ? row._raw : row;
            const displayRow = row && typeof row === 'object'
              ? Object.keys(row).reduce((acc, key) => {
                  if (key !== '_raw') acc[key] = row[key];
                  return acc;
                }, {})
              : row;

            return (
            <tr key={rowIndex}>
              {Object.values(displayRow).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
              <td>
                <div className="table-actions">
                  <button className="table-action-btn view" onClick={() => onView(rowData)}>
                    عرض
                  </button>
                  {isAdmin ? (
                    <>  
                  <button className="table-action-btn edit" onClick={() => onEdit(rowData)}>
                    تعديل
                  </button>
                  <button className="table-action-btn delete" onClick={() => onDelete(rowData)}>
                    حذف
                  </button>
                  </>
                  ):null}
                  {!isAdmin && onAddToCart ? (
                    <button className="table-action-btn cart-btn" onClick={() => onAddToCart(rowData)}>
                      إضافة للعربة
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
