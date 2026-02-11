import {
  OPEN_MODAL,
  CLOSE_MODAL,
  OPEN_CART_MODAL,
  CLOSE_CART_MODAL,
} from '../Type';

const initialState = {
  isOpen: false,
  modalType: null, // 'add-to-cart', 'cart', 'confirmation', etc.
  modalData: null,
  isCartOpen: false
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        isOpen: true,
        modalType: action.payload.modalType,
        modalData: action.payload.data || null
      };
      
    case CLOSE_MODAL:
      return {
        ...state,
        isOpen: false,
        modalType: null,
        modalData: null
      };
      
    case OPEN_CART_MODAL:
      return {
        ...state,
        isCartOpen: true
      };
      
    case CLOSE_CART_MODAL:
      return {
        ...state,
        isCartOpen: false
      };
      
    default:
      return state;
  }
};

export default modalReducer;
