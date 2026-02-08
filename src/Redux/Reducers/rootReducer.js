
import { combineReducers } from 'redux'
import bookReducer from './bookReducer'
import authReducer from './authReducer'
import cartReducer from './cartReducer'
import modalReducer from './modalReducer'
import orderReducer from './orderReducer'
import paymentReducer from './paymentReducer'

export default combineReducers({
    allBooks: bookReducer,
    authReducer: authReducer,
    cart: cartReducer,
    modal: modalReducer,
    orders: orderReducer,
    payment: paymentReducer,
})
