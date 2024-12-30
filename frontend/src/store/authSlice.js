// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem('token'),
        isLoading: false,
        error: null
    },
    reducers: {
        setCredentials: (state, { payload }) => {
            state.user = payload.user;
            state.token = payload.token;
            localStorage.setItem('token', payload.token);
            localStorage.setItem('user', JSON.stringify(payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setError: (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        },
        setLoading: (state, { payload }) => {
            state.isLoading = payload;
        }
    }
});

export const { setCredentials, logout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;