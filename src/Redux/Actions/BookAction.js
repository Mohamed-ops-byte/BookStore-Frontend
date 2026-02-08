import { GET_ALL_BOOKS, GET_ONE_BOOK, GET_ERROR, GET_BOOKS_BY_CATEGORY, CREATE_BOOK,UPDATE_BOOK,DELETE_BOOK} from '../Type'
import { useGetData } from '../../hooks/useGetData'
import { useInsertDataWithImage } from '../../hooks/useInsertData'
import { useInUpdateDataWithImage } from '../../hooks/useUpdateData'
import {useDeleteData} from '../../hooks/useDeleteData'

//get all books without pagination
export const getAllBooks = () => async (dispatch) => {
    try {
        const response = await useGetData(`/api/books`);

        dispatch({
            type: GET_ALL_BOOKS,
            payload: response.data,
        })

    } catch (e) {
        dispatch({
            type: GET_ERROR,
            payload: "Error " + e,
        })
    }
}

//get one book by id
export const getOneBook = (id) => async (dispatch) => {
    try {
        const response = await useGetData(`/api/books/${id}`);

        dispatch({
            type: GET_ONE_BOOK,
            payload: response.data,
        })

    } catch (e) {
        dispatch({
            type: GET_ERROR,
            payload: "Error " + e,
        })
    }
}

//get books by category
export const getBooksByCategory = (category) => async (dispatch) => {
    try {
        const response = await useGetData(`/api/books?category=${category}`);

        dispatch({
            type: GET_BOOKS_BY_CATEGORY,
            payload: response.data,
        })

    } catch (e) {
        dispatch({
            type: GET_ERROR,
            payload: "Error " + e,
        })
    }
}

//create book with image
export const createBook = (formatData) => async (dispatch) => {
    try {
        const response = await useInsertDataWithImage("/api/books", formatData);
        dispatch({
            type: CREATE_BOOK,
            payload: response.data,
            loading: true
        })

    } catch (e) {
        dispatch({
            type: GET_ERROR,
            payload: "Error  " + e,
        })
    }

}


//update book with id

export const updateBook = (id,data) => async (dispatch) => {
    try {
        const response = await useInUpdateDataWithImage(`/api/books/${id}`,data);
        dispatch({
            type: UPDATE_BOOK,
            payload: response,
            loading: true
        })

    } catch (e) {
        dispatch({
            type: GET_ERROR,
            payload: "Error " + e,
        })
    }
}

export const deleteBook = (id) => async (dispatch) => {
    try {
        const response = await useDeleteData(`/api/books/${id}`);    
        dispatch({
            type: DELETE_BOOK,
            payload: response,
            loading: true
        })
    } catch (e) {
        dispatch({
            type: GET_ERROR,
            payload: "Error " + e,
        })
    }
}


//get one category with
// export const getOneCategory = (id) => async (dispatch) => {
//     try {
//         const response = await useGetData(`/api/v1/categories/${id}`);

//         dispatch({
//             type: GET_ONE_CATEGORY,
//             payload: response,
//         })

//     } catch (e) {
//         dispatch({
//             type: GET_ERROR,
//             payload: "Error " + e,
//         })
//     }
// }

//get all category with pagination
// export const getAllCategoryPage = (page) => async (dispatch) => {
//     try {
//         const response = await useGetData(`/api/v1/categories?limit=6&page=${page}`);
//         dispatch({
//             type: GET_ALL_CATEGORY,
//             payload: response,
//         })

//     } catch (e) {
//         dispatch({
//             type: GET_ERROR,
//             payload: "Error " + e,
//         })
//     }
// }


//get all category with pagination
// export const createCategory = (formData) => async (dispatch) => {
//     try {
//         const response = await useInsertDataWithImage(`/api/v1/categories`, formData);
//         dispatch({
//             type: CREATE_CATEGORY,
//             payload: response,
//             loading: true
//         })

//     } catch (e) {
//         dispatch({
//             type: GET_ERROR,
//             payload: "Error " + e,
//         })
//     }
// }