import {  LOGIN_USER, REGISTER_USER } from '../Type'

import { useInsertData } from '../../hooks/useInsertData'
// import { useGetData, useGetDataToken } from './../../hooks/useGetData';
// import { useInsUpdateData } from '../../hooks/useUpdateData';




//login  user 
export const loginUser = (data) => async (dispatch) => {
    try {
        const response = await useInsertData(`/api/login`, data);
        console.log('Login response:', response);
        dispatch({
            type: LOGIN_USER,
            payload: response.data,
            loading: false
        })

    } catch (e) {
        console.error('Login error:', e);
        dispatch({
            type: LOGIN_USER,
            payload: e.response?.data || { message: 'فشل الاتصال بالخادم' },
            loading: false
        })
    }
}

//register user 
export const registerUser = (data) => async (dispatch) => {
    try {
        const response = await useInsertData(`/api/register`, data);
        console.log('Register response:', response);
        dispatch({
            type: REGISTER_USER,
            payload: response.data,
            loading: false
        })

    } catch (e) {
        console.error('Register error:', e);
        dispatch({
            type: REGISTER_USER,
            payload: e.response?.data || { message: 'فشل الاتصال بالخادم' },
            loading: false
        })
    }
}