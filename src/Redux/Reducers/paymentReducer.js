// src/Redux/Reducers/paymentReducer.js

import {
  CREATE_PAYMENT_INTENT,
  PAYMENT_PROCESSING,
  PAYMENT_SUCCESS,
  PAYMENT_ERROR,
  CLEAR_PAYMENT_ERROR,
  PAYMENT_LOADING,
} from '../Type';

const initialState = {
  paymentIntent: null,
  clientSecret: null,
  loading: false,
  processing: false,
  success: false,
  error: null,
  paymentDetails: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_PAYMENT_INTENT:
      return {
        ...state,
        paymentIntent: action.payload,
        clientSecret: action.payload.client_secret,
        loading: false,
        success: false,
        error: null,
      };

    case PAYMENT_PROCESSING:
      return {
        ...state,
        processing: true,
        loading: false,
        error: null,
      };

    case PAYMENT_SUCCESS:
      return {
        ...state,
        paymentDetails: action.payload,
        success: true,
        processing: false,
        loading: false,
        error: null,
      };

    case PAYMENT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        processing: false,
        success: false,
      };

    case CLEAR_PAYMENT_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default paymentReducer;
