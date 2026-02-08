import {
  OPEN_MODAL,
  CLOSE_MODAL,
  OPEN_CART_MODAL,
  CLOSE_CART_MODAL,
} from '../Type';

// فتح مودال عام
export const openModal = (modalType, data = null) => {
  return {
    type: OPEN_MODAL,
    payload: { modalType, data }
  };
};

// إغلاق المودال
export const closeModal = () => {
  return {
    type: CLOSE_MODAL
  };
};

// فتح مودال السلة
export const openCartModal = () => {
  return {
    type: OPEN_CART_MODAL
  };
};

// إغلاق مودال السلة
export const closeCartModal = () => {
  return {
    type: CLOSE_CART_MODAL
  };
};
