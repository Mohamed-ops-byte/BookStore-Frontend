import {  GET_ERROR, GET_ALL_BOOKS, GET_ONE_BOOK, GET_BOOKS_BY_CATEGORY, CREATE_BOOK, UPDATE_BOOK, DELETE_BOOK } from '../Type'

const inital = {
    book: [],
    oneBook: [],
    categoryBooks: [],
    loading: true,
}
const bookReducer = (state = inital, action) => {
    switch (action.type) {
        case GET_ALL_BOOKS:
            return {
                ...state,
                book: action.payload,
                loading: false,
            }
        case GET_ONE_BOOK:
            return {
                ...state,
                oneBook: action.payload,
                loading: false,
            }
        case GET_BOOKS_BY_CATEGORY:
            return {
                ...state,
                categoryBooks: action.payload,
                loading: false,
            }
        case CREATE_BOOK:
            return {
                ...state,
                book: action.payload,
                loading: false
            }
        case UPDATE_BOOK:
            return {
                ...state,
                oneBook: action.payload,
                loading: false
            }
        case DELETE_BOOK:
            return {
                ...state,
                book: action.payload,
                loading: false
            }
        case GET_ERROR:
            return {
                ...state,
                loading: false,
                book: [],
            }
        default:
            return state;
    }
}
export default bookReducer;