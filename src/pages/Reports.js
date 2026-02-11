import React, { useMemo, useState } from 'react';


const Reports = () => {
  const [range, setRange] = useState('7d');

  const dataByRange = {
    '7d': {
      revenue: 12500,
      orders: 128,
      returns: 4,
      avgOrder: 98,
      conversion: 3.1,
      trend: [60, 72, 50, 85, 70, 95, 105],
      labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      topBooks: [
        { title: 'البؤساء', sales: 34, revenue: 5100 },
        { title: 'الحرب والسلام', sales: 26, revenue: 4200 },
        { title: 'تاريخ الحضارات', sales: 18, revenue: 3100 },
      ],
      categories: [
        { name: 'روايات', value: 45 },
        { name: 'علمية', value: 25 },
        { name: 'تاريخية', value: 18 },
        { name: 'أطفال', value: 12 },
      ],
    },
    '30d': {
      revenue: 48250,
      orders: 506,
      returns: 17,
      avgOrder: 95,
      conversion: 3.4,
      trend: [40, 55, 60, 70, 65, 78, 90, 80, 75, 70, 85, 92, 96, 88, 110, 105, 98, 120, 115, 108, 101, 99, 90, 95, 100, 108, 112, 118, 124, 130],
      labels: Array.from({ length: 30 }, (_, i) => `اليوم ${i + 1}`),
      topBooks: [
        { title: 'فن اللامبالاة', sales: 82, revenue: 9500 },
        { title: 'البؤساء', sales: 76, revenue: 8900 },
        { title: 'الحرب والسلام', sales: 70, revenue: 8600 },
      ],
      categories: [
        { name: 'روايات', value: 48 },
        { name: 'تنمية', value: 22 },
        { name: 'علمية', value: 16 },
        { name: 'أطفال', value: 14 },
      ],
    },
    '90d': {
      revenue: 138400,
      orders: 1520,
      returns: 52,
      avgOrder: 91,
      conversion: 3.0,
      trend: Array.from({ length: 12 }, (_, i) => 70 + i * 8),
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      topBooks: [
        { title: 'صراع العروش', sales: 210, revenue: 24200 },
        { title: 'العادات الذرية', sales: 180, revenue: 19800 },
        { title: 'الخيميائي', sales: 150, revenue: 16200 },
      ],
      categories: [
        { name: 'روايات', value: 50 },
        { name: 'تنمية', value: 20 },
        { name: 'تاريخية', value: 17 },
        { name: 'أطفال', value: 13 },
      ],
    },
  };

  const current = dataByRange[range];

  const kpis = useMemo(() => ([
    { label: 'معدل التحويل', value: `${current.conversion}%`, badge: '+0.4% مقابل الفترة السابقة' },
    { label: 'متوسط قيمة الطلب', value: `${current.avgOrder} ج.م`, badge: 'تحسن طفيف' },
    { label: 'الطلبات المرتجعة', value: current.returns, badge: 'يجب المتابعة' },
  ]), [current]);

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <p className="eyebrow">التقارير والتحليلات</p>
          <h1>لوحة التقارير</h1>
          <p className="subtitle">نظرة شاملة على الأداء والمبيعات عبر الفترات الزمنية.</p>
        </div>
        <div className="range-picker">
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 3 أشهر</option>
          </select>
        </div>
      </header>

      <section className="report-stats">
        <div className="report-card primary">
          <div>
            <p className="label">إجمالي الإيرادات</p>
            <h2>{current.revenue.toLocaleString('ar-EG')} ج.م</h2>
            <span className="muted">يشمل الطلبات المكتملة فقط</span>
          </div>
          <div className="pill">📈 نمو مستمر</div>
        </div>
        <div className="report-card">
          <p className="label">إجمالي الطلبات</p>
          <h3>{current.orders}</h3>
          <span className="muted">متوسط يومي {(current.orders / (range === '7d' ? 7 : range === '30d' ? 30 : 90)).toFixed(1)} طلب</span>
        </div>
        <div className="report-card">
          <p className="label">متوسط الطلب</p>
          <h3>{current.avgOrder} ج.م</h3>
          <span className="muted">مقارنة بالفترة السابقة +2.5%</span>
        </div>
        <div className="report-card">
          <p className="label">المرتجعات</p>
          <h3>{current.returns}</h3>
          <span className="muted">نسبة {(current.returns / current.orders * 100).toFixed(1)}%</span>
        </div>
      </section>

      <section className="reports-grid">
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h4>إيرادات الفترة</h4>
              <p className="muted">توزيع الإيرادات حسب الأيام</p>
            </div>
            <span className="pill ghost">مؤشر نمو</span>
          </div>
          <div className="bars">
            {current.trend.map((value, idx) => (
              <div key={idx} className="bar" style={{ height: `${value}%` }}>
                <span className="bar-value">{value}</span>
                <span className="bar-label">{current.labels[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="kpi-card">
          <div className="card-header">
            <div>
              <h4>مؤشرات الأداء</h4>
              <p className="muted">تلخيص سريع للأداء</p>
            </div>
          </div>
          <div className="kpi-list">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="kpi-item">
                <div>
                  <p className="label">{kpi.label}</p>
                  <h3>{kpi.value}</h3>
                </div>
                <span className="pill ghost">{kpi.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reports-grid">
        <div className="table-card">
          <div className="card-header">
            <h4>أعلى الكتب مبيعاً</h4>
            <span className="muted">حسب المبيعات الكمية والإيراد</span>
          </div>
          <div className="table-body">
            {current.topBooks.map((book) => (
              <div key={book.title} className="table-row">
                <div>
                  <p className="customer">{book.title}</p>
                  <p className="muted">{book.sales} نسخة</p>
                </div>
                <div className="table-meta">
                  <p className="total">{book.revenue.toLocaleString('ar-EG')} ج.م</p>
                  <span className="status-chip success">الأكثر مبيعاً</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-card">
          <div className="card-header">
            <h4>توزيع المبيعات حسب الفئة</h4>
            <span className="muted">نسبة مساهمة كل فئة</span>
          </div>
          <div className="category-list">
            {current.categories.map((cat) => (
              <div key={cat.name} className="category-row">
                <div>
                  <p className="customer">{cat.name}</p>
                  <p className="muted">{cat.value}% من المبيعات</p>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${cat.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
