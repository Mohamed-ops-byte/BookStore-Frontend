

import { createStore, applyMiddleware } from 'redux'
import {thunk} from 'redux-thunk';
import rootReducer from './Reducers/rootReducer'

const initailState = {}

const meddleware = [thunk]

const store = createStore(rootReducer, initailState, applyMiddleware(...meddleware))
export default store