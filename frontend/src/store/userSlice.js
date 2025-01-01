import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base API URL
const API_BASE_URL = 'http://localhost:5000/api/users';

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
});

// Async thunk to fetch a single user by ID
export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch user');
    }
});

// Async thunk to update a user
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, userData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update user');
    }
});

// Async thunk to delete a user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
});

// Add createUser thunk
export const createUser = createAsyncThunk('users/createUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_BASE_URL, userData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to create user');
    }
});

// User slice definition
const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        currentUser: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all users
        builder.addCase(fetchUsers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.users = payload;
        });
        builder.addCase(fetchUsers.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Fetch user by ID
        builder.addCase(fetchUserById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUserById.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.currentUser = payload;
        });
        builder.addCase(fetchUserById.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Update user
        builder.addCase(updateUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            const index = state.users.findIndex((user) => user.id === payload.user.id);
            if (index !== -1) {
                state.users[index] = payload.user;
            }
        });
        builder.addCase(updateUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Delete user
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.users = state.users.filter((user) => user.id !== payload.id);
        });
        builder.addCase(deleteUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Add createUser cases
        builder.addCase(createUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.users.push(payload.user);
        });
        builder.addCase(createUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
    },
});

// Export actions and reducer
export const { resetError } = userSlice.actions;
export default userSlice.reducer;
