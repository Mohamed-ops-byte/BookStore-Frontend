import baseURL from './baseURL';

const API_BASE = '/api';

export const favoriteService = {
  /**
   * Get all user's favorite books
   */
  getUserFavorites: async (page = 1, perPage = 20) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.get(`${API_BASE}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          page,
          per_page: perPage,
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add a book to favorites
   */
  addToFavorites: async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.post(
        `${API_BASE}/favorites`,
        { book_id: bookId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Remove a book from favorites
   */
  removeFromFavorites: async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.delete(
        `${API_BASE}/favorites/${bookId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Toggle favorite status for a book
   */
  toggleFavorite: async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.post(
        `${API_BASE}/favorites/toggle`,
        { book_id: bookId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check if a book is favorited
   */
  isFavorited: async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.get(
        `${API_BASE}/favorites/check/${bookId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const orderService = {
  /**
   * Get user's orders (customer) or all orders (admin)
   */
  getOrders: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.get(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          page,
          per_page: perPage,
          ...filters,
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a specific order
   */
  getOrder: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.get(
        `${API_BASE}/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new order
   */
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.post(
        `${API_BASE}/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update an order (admin only)
   */
  updateOrder: async (orderId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseURL.put(
        `${API_BASE}/orders/${orderId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
