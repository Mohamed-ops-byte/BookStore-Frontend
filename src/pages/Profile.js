import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import baseURL from '../Api/baseURL';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('حدث خطأ في تحميل بيانات المستخدم');
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('البريد الإلكتروني غير صحيح');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.put('/api/user/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        toast.success('تم تحديث الملف الشخصي بنجاح');
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errors.forEach(err => toast.error(err));
      } else {
        toast.error('فشل تحديث الملف الشخصي');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation) {
      toast.error('جميع حقول كلمة المرور مطلوبة');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.put('/api/user/change-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        setShowPasswordModal(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errors.forEach(err => toast.error(err));
      } else {
        toast.error('فشل تغيير كلمة المرور');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('يجب اختيار صورة فقط');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setShowAvatarModal(true);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      toast.error('الرجاء اختيار صورة');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await baseURL.post('/api/user/upload-avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowAvatarModal(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        toast.success('تم تحديث الصورة الشخصية بنجاح');
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('فشل تحديث الصورة الشخصية');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('هل أنت متأكد من حذف الصورة الشخصية؟')) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.delete('/api/user/remove-avatar', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('تم حذف الصورة الشخصية بنجاح');
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('فشل حذف الصورة الشخصية');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={`http://127.0.0.1:8000${user.avatar}`} alt={user.name} className="avatar-image" />
              ) : (
                <span className="avatar-text">
                  {user?.name?.charAt(0)?.toUpperCase() || '👤'}
                </span>
              )}
            </div>
            <button 
              className="avatar-upload-btn"
              onClick={() => document.getElementById('avatar-input').click()}
              title="تغيير الصورة الشخصية"
            >
              📷
            </button>
            {user?.avatar && (
              <button 
                className="avatar-remove-btn"
                onClick={handleRemoveAvatar}
                title="حذف الصورة الشخصية"
              >
                🗑️
              </button>
            )}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>
          <h1 className="profile-title">الملف الشخصي</h1>
          <p className="profile-subtitle">إدارة معلوماتك الشخصية</p>
        </div>

        <div className="profile-content">
          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-info-card">
                <div className="info-item">
                  <label className="info-label">
                    <span className="info-icon">👤</span>
                    الاسم
                  </label>
                  <p className="info-value">{user?.name}</p>
                </div>

                <div className="info-item">
                  <label className="info-label">
                    <span className="info-icon">📧</span>
                    البريد الإلكتروني
                  </label>
                  <p className="info-value">{user?.email}</p>
                </div>

                <div className="info-item">
                  <label className="info-label">
                    <span className="info-icon">📅</span>
                    تاريخ الانضمام
                  </label>
                  <p className="info-value">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'غير متوفر'
                    }
                  </p>
                </div>
              </div>

              <div className="profile-actions">
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  icon="✏️"
                >
                  تعديل الملف الشخصي
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(true)}
                  icon="🔒"
                >
                  تغيير كلمة المرور
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  icon="↩️"
                >
                  العودة للوحة التحكم
                </Button>
              </div>
            </div>
          ) : (
            <form className="profile-edit-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <Input
                  label="الاسم"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك"
                  icon="👤"
                  required
                />
              </div>

              <div className="form-group">
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="أدخل بريدك الإلكتروني"
                  icon="📧"
                  required
                />
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  icon="💾"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  icon="❌"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
          });
        }}
        title="تغيير كلمة المرور"
        icon="🔒"
      >
        <form onSubmit={handleChangePassword} className="password-form">
          <div className="form-group">
            <Input
              label="كلمة المرور الحالية"
              type="password"
              name="current_password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              placeholder="أدخل كلمة المرور الحالية"
              icon="🔐"
              required
            />
          </div>

          <div className="form-group">
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              placeholder="أدخل كلمة المرور الجديدة"
              icon="🔑"
              required
              minLength={8}
            />
            <small className="input-hint">يجب أن تكون 8 أحرف على الأقل</small>
          </div>

          <div className="form-group">
            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              name="new_password_confirmation"
              value={passwordData.new_password_confirmation}
              onChange={handlePasswordChange}
              placeholder="أعد إدخال كلمة المرور الجديدة"
              icon="🔑"
              required
              minLength={8}
            />
          </div>

          <div className="modal-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              icon="💾"
            >
              {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({
                  current_password: '',
                  new_password: '',
                  new_password_confirmation: '',
                });
              }}
              disabled={loading}
              icon="❌"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => {
          setShowAvatarModal(false);
          setAvatarFile(null);
          setAvatarPreview(null);
        }}
        title="تغيير الصورة الشخصية"
        icon="📷"
      >
        <div className="avatar-upload-modal">
          <div className="avatar-preview-container">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="avatar-preview-image" />
            ) : (
              <div className="avatar-preview-placeholder">
                <span>معاينة الصورة</span>
              </div>
            )}
          </div>
          
          <div className="avatar-info">
            <p className="avatar-hint">📌 الحد الأقصى لحجم الصورة: 2 ميجابايت</p>
            <p className="avatar-hint">📌 الأنواع المدعومة: JPG, PNG, GIF, WebP</p>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="primary"
              disabled={loading || !avatarFile}
              onClick={handleUploadAvatar}
              icon="📤"
            >
              {loading ? 'جاري الرفع...' : 'رفع الصورة'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAvatarModal(false);
                setAvatarFile(null);
                setAvatarPreview(null);
              }}
              disabled={loading}
              icon="❌"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
