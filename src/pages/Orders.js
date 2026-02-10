import React, { useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllOrders } from '../Redux/Actions/orderAction';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [search, setSearch] = useState('');
  const { list: orders = [], loading, error, stats: serverStats } = useSelector((state) => state.orders);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(
        getAllOrders({
          status: statusFilter,
          search,
          sort_by: 'created_at',
          sort_order: 'desc',
        })
      );
    }, 250);

    return () => clearTimeout(debounce);
  }, [dispatch, statusFilter, search]);

  const stats = useMemo(() => {
    if (serverStats) {
      return {
        total: serverStats.total ?? 0,
        pending: serverStats.pending ?? 0,
        completed: serverStats.completed ?? 0,
        canceled: serverStats.canceled ?? 0,
        revenue: serverStats.revenue ?? 0,
      };
    }

    const pending = orders.filter((o) => o.status === 'قيد التنفيذ').length;
    const completed = orders.filter((o) => o.status === 'مكتمل').length;
    const canceled = orders.filter((o) => o.status === 'ملغي').length;
    const revenue = orders
      .filter((o) => o.status === 'مكتمل')
      .reduce((sum, o) => sum + (o.totals?.total ?? o.total ?? 0), 0);

    return { total: orders.length, pending, completed, canceled, revenue };
  }, [orders, serverStats]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(Math.round(value || 0));

  const formatPaymentMethod = (method) => {
    if (!method) return 'غير محدد';
    const lower = method.toLowerCase();
    if (lower.includes('card')) return 'بطاقة';
    if (lower.includes('cash')) return 'دفع عند الاستلام';
    return method;
  };

  const highlightedOrderId = location.state?.orderId;

  return (
    <div className="orders-page">
      {!isAdmin ? (
        <div className="unauthorized-message">
          <h2>🔒 محصورة على الإداريين</h2>
          <p>
            صفحة إدارة الطلبات متاحة فقط للمسؤولين.
            <br />
            يمكنك عرض طلباتك الشخصية من صفحة الحساب الخاص بك.
          </p>
          <button
            onClick={() => navigate('/')}
            className="login-button"
          >
            العودة للرئيسية
          </button>
        </div>
      ) : (
        <>
      <header className="orders-header">
        <div>
          <p className="eyebrow">إدارة الطلبات</p>
          <h1>لوحة تحكم الطلبات</h1>
          <p className="subtitle">تابع الطلبات، حالتها، والمدفوعات في مكان واحد.</p>
        </div>
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="بحث برقم الطلب أو اسم العميل"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="الكل">كل الحالات</option>
            <option value="قيد التنفيذ">قيد التنفيذ</option>
            <option value="مكتمل">مكتمل</option>
            <option value="ملغي">ملغي</option>
          </select>
        </div>
      </header>

      {error && (
        <div className="orders-error">
          ⚠️ حدث خطأ أثناء تحميل الطلبات. حاول مرة أخرى.
        </div>
      )}

      <section className="order-stats">
        <div className="stat-card highlight">
          <div>
            <p className="label">إجمالي الطلبات</p>
            <h2>{stats.total}</h2>
            <span className="muted">آخر البيانات من الخادم</span>
          </div>
          <div className="stat-icon">📦</div>
        </div>
        <div className="stat-card">
          <div>
            <p className="label">قيد التنفيذ</p>
            <h2>{stats.pending}</h2>
            <span className="badge warning">قيد المتابعة</span>
          </div>
          <div className="stat-icon">⏳</div>
        </div>
        <div className="stat-card">
          <div>
            <p className="label">مكتمل</p>
            <h2>{stats.completed}</h2>
            <span className="badge success">تم التسليم</span>
          </div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card">
          <div>
            <p className="label">ملغي</p>
            <h2>{stats.canceled}</h2>
            <span className="badge danger">متابعة السبب</span>
          </div>
          <div className="stat-icon">⚠️</div>
        </div>
        <div className="stat-card">
          <div>
            <p className="label">إيرادات مكتملة</p>
            <h2>{formatCurrency(stats.revenue)} ج.م</h2>
            <span className="muted">يشمل الطلبات المكتملة فقط</span>
          </div>
          <div className="stat-icon">💰</div>
        </div>
      </section>

      {loading ? (
        <div className="orders-loader">جار تحميل الطلبات من قاعدة البيانات...</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">📭</div>
          <h2>لا توجد طلبات بعد</h2>
          <p>عند تأكيد أي عملية شراء ستظهر هنا.</p>
        </div>
      ) : (
        <section className="orders-grid">
          <div className="orders-table">
            <div className="table-header">
              <h3>الطلبات الحالية</h3>
              <span className="hint">{orders.length} طلب</span>
            </div>
            <div className="table-body">
              {orders.map((order) => {
                const total = order.totals?.total ?? order.total ?? 0;
                const itemsCount =
                  order.items_count ??
                  (order.items
                    ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
                    : 0);
                const orderDate = order.created_at
                  ? new Date(order.created_at).toLocaleDateString('ar-EG')
                  : order.date || '—';

                const chipClass =
                  order.status === 'مكتمل'
                    ? 'success'
                    : order.status === 'قيد التنفيذ'
                      ? 'warning'
                      : 'danger';

                return (
                  <div
                    key={order.order_number || order.id}
                    className={`table-row ${highlightedOrderId === (order.order_number || order.id) ? 'highlighted' : ''}`}
                  >
                    <div className="cell wide">
                      <p className="order-id">{order.order_number || order.id}</p>
                      <p className="muted">{orderDate}</p>
                    </div>
                    <div className="cell">
                      <p className="customer">{order.customer_name}</p>
                      <p className="muted">{itemsCount} عناصر</p>
                    </div>
                    <div className="cell">
                      <p className="total">{formatCurrency(total)} ج.م</p>
                      <p className="muted">{formatPaymentMethod(order.payment_method)}</p>
                    </div>
                    <div className="cell">
                      <span className={`status-chip ${chipClass}`}>
                        {order.status}
                      </span>
                      <p className="muted">الشحن: {order.shipping_status || 'غير محدد'}</p>
                    </div>
                    <div className="cell actions">
                      <button className="ghost-btn">تفاصيل</button>
                      <button className="ghost-btn">تحديث الحالة</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="side-panel">
            <div className="panel-section">
              <div className="panel-header">
                <h4>الأولوية</h4>
                <span className="hint">طلبات تحتاج تدخل</span>
              </div>
              <div className="priority-list">
                {orders
                  .filter((o) => o.status !== 'مكتمل')
                  .slice(0, 3)
                  .map((order) => (
                    <div key={order.order_number || order.id} className="priority-card">
                      <div>
                        <p className="order-id">{order.order_number || order.id}</p>
                        <p className="customer">{order.customer_name}</p>
                      </div>
                      <div className="priority-meta">
                        <span className={`status-chip ${order.status === 'ملغي' ? 'danger' : 'warning'}`}>
                          {order.status}
                        </span>
                        <p className="muted">{order.shipping_status || 'غير محدد'}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-header">
                <h4>خط سير اليوم</h4>
                <span className="hint">مواعيد الشحن</span>
              </div>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="dot active"></div>
                  <div>
                    <p className="customer">تجهيز الشحنات</p>
                    <p className="muted">09:00 - 11:00</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="dot active"></div>
                  <div>
                    <p className="customer">تسليم لشركة الشحن</p>
                    <p className="muted">12:00 - 14:00</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="dot"></div>
                  <div>
                    <p className="customer">متابعة الحالات المعلقة</p>
                    <p className="muted">14:30 - 15:30</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="dot"></div>
                  <div>
                    <p className="customer">مراجعة المدفوعات</p>
                    <p className="muted">16:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
        </>
      )}
    </div>
  );
};

export default Orders;
