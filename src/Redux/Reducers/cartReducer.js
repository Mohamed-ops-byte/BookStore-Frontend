import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  GET_CART_ITEMS,
} from '../Type';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null
};

// حساب إجمالي السعر والعدد
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  return { totalItems, totalPrice };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_ITEMS:
      const loadedTotals = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems: loadedTotals.totalItems,
        totalPrice: loadedTotals.totalPrice,
        loading: false
      };
      
    case ADD_TO_CART: {
      const { book, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === book.id);
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // تحديث الكمية للكتاب الموجود
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // إضافة كتاب جديد
        updatedItems = [...state.items, {
          ...book,
          quantity: quantity,
          addedAt: new Date().toISOString()
        }];
      }
      
      const addTotals = calculateTotals(updatedItems);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: addTotals.totalItems,
        totalPrice: addTotals.totalPrice
      };
    }
    
    case REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const removeTotals = calculateTotals(updatedItems);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: removeTotals.totalItems,
        totalPrice: removeTotals.totalPrice
      };
    }
    
    case UPDATE_CART_QUANTITY: {
      const { bookId, quantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      );
      const updateTotals = calculateTotals(updatedItems);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updateTotals.totalItems,
        totalPrice: updateTotals.totalPrice
      };
    }
    
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
    default:
      return state;
  }
};

export default cartReducer;
