import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  GET_CART_ITEMS,
} from '../Type';

// إضافة كتاب إلى السلة
export const addToCart = (book, quantity = 1) => {
  return (dispatch) => {
    try {
      // حفظ في localStorage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // التحقق إذا كان الكتاب موجود بالفعل
      const existingItemIndex = cart.findIndex(item => item.id === book.id);
      
      if (existingItemIndex >= 0) {
        // تحديث الكمية
        cart[existingItemIndex].quantity += quantity;
      } else {
        // إضافة كتاب جديد
        cart.push({
          ...book,
          quantity: quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      dispatch({
        type: ADD_TO_CART,
        payload: { book, quantity }
      });
      
      return { success: true, message: 'تمت الإضافة إلى السلة بنجاح' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'حدث خطأ أثناء الإضافة' };
    }
  };
};

// حذف كتاب من السلة
export const removeFromCart = (bookId) => {
  return (dispatch) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = cart.filter(item => item.id !== bookId);
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      dispatch({
        type: REMOVE_FROM_CART,
        payload: bookId
      });
      
      return { success: true, message: 'تم الحذف من السلة بنجاح' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'حدث خطأ أثناء الحذف' };
    }
  };
};

// تحديث كمية كتاب في السلة
export const updateCartQuantity = (bookId, quantity) => {
  return (dispatch) => {
    try {
      if (quantity <= 0) {
        return dispatch(removeFromCart(bookId));
      }
      
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemIndex = cart.findIndex(item => item.id === bookId);
      
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        dispatch({
          type: UPDATE_CART_QUANTITY,
          payload: { bookId, quantity }
        });
        
        return { success: true };
      }
      
      return { success: false, message: 'الكتاب غير موجود في السلة' };
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return { success: false, message: 'حدث خطأ أثناء التحديث' };
    }
  };
};

// مسح السلة بالكامل
export const clearCart = () => {
  return (dispatch) => {
    try {
      localStorage.removeItem('cart');
      
      dispatch({
        type: CLEAR_CART
      });
      
      return { success: true, message: 'تم مسح السلة بنجاح' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'حدث خطأ أثناء مسح السلة' };
    }
  };
};

// جلب محتويات السلة
export const getCartItems = () => {
  return (dispatch) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      dispatch({
        type: GET_CART_ITEMS,
        payload: cart
      });
      
      return { success: true, data: cart };
    } catch (error) {
      console.error('Error getting cart items:', error);
      return { success: false, message: 'حدث خطأ أثناء جلب السلة' };
    }
  };
};
