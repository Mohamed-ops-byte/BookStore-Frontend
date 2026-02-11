import { GET_ALL_ORDERS, CREATE_ORDER_ENTRY, ORDERS_LOADING, ORDERS_ERROR } from '../Type';

const initialState = {
  list: [],
  loading: false,
  error: null,
  meta: {},
  stats: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDERS_LOADING:
      return { ...state, loading: true, error: null };

    case GET_ALL_ORDERS:
      return {
        ...state,
        list: action.payload || [],
        meta: action.meta || {},
        stats: action.stats || null,
        loading: false,
      };

    case CREATE_ORDER_ENTRY:
      return {
        ...state,
        list: [action.payload, ...(state.list || [])],
        loading: false,
      };

    case ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default orderReducer;
