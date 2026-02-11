import { GET_ALL_ORDERS, CREATE_ORDER_ENTRY, ORDERS_LOADING, ORDERS_ERROR } from '../Type';
import { useGetData } from '../../hooks/useGetData';
import { useInsertData } from '../../hooks/useInsertData';

const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== 'الكل') {
    params.append('status', filters.status);
  }

  if (filters.search && filters.search.trim()) {
    params.append('search', filters.search.trim());
  }

  if (filters.sort_by) {
    params.append('sort_by', filters.sort_by);
  }

  if (filters.sort_order) {
    params.append('sort_order', filters.sort_order);
  }

  return params.toString();
};

export const getAllOrders = (filters = {}) => async (dispatch) => {
  dispatch({ type: ORDERS_LOADING });

  try {
    const query = buildQueryString(filters);
    const response = await useGetData(`/api/orders${query ? `?${query}` : ''}`);
    const data = response?.data ?? response;

    dispatch({
      type: GET_ALL_ORDERS,
      payload: data,
      meta: response?.meta,
      stats: response?.stats,
    });
  } catch (error) {
    dispatch({
      type: ORDERS_ERROR,
      payload: 'Error ' + error,
    });
  }
};

export const createOrderEntry = (payload) => async (dispatch) => {
  try {
    console.log('🔄 Creating order with payload:', payload);
    const token = localStorage.getItem('token');
    
    if (!token) {
      const errorMsg = 'يجب تسجيل الدخول أولاً';
      console.error('❌ No token:', errorMsg);
      dispatch({
        type: ORDERS_ERROR,
        payload: errorMsg,
      });
      return { success: false, message: errorMsg };
    }
    
    const response = await useInsertData('/api/orders', payload);
    console.log('✅ Order creation response:', response);
    
    // axios response structure: response.data contains the server response
    const data = response?.data?.data ?? response?.data ?? response;
    console.log('📦 Extracted data:', data);

    dispatch({
      type: CREATE_ORDER_ENTRY,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    console.error('❌ Order creation error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const errorMsg = 'انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى';
      console.error('🔐 Session expired:', errorMsg);
      dispatch({
        type: ORDERS_ERROR,
        payload: errorMsg,
      });
      return { success: false, message: errorMsg };
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.order_number?.join(', ') ||
                        error.message || 
                        'تعذر حفظ الطلب في الخادم';
    
    dispatch({
      type: ORDERS_ERROR,
      payload: errorMessage,
    });

    return { 
      success: false, 
      message: errorMessage,
      error: error.response?.data
    };
  }
};
