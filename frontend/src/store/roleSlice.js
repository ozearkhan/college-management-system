// store/roleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { API_BASE_URL } from '@/config/api';

export const fetchRoles = createAsyncThunk(
    'roles/fetchRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/roles`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch roles');
        }
    }
);

export const fetchRolePermissions = createAsyncThunk(
    'roles/fetchRolePermissions',
    async (role, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/roles/${role}/permissions`);
            return { role, permissions: response.data.permissions };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch permissions');
        }
    }
);

const roleSlice = createSlice({
    name: 'roles',
    initialState: {
        roles: [],
        rolePermissions: {},
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRoles.fulfilled, (state, { payload }) => {
                state.roles = payload;
                state.isLoading = false;
            })
            .addCase(fetchRoles.rejected, (state, { payload }) => {
                state.error = payload;
                state.isLoading = false;
            })
            .addCase(fetchRolePermissions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRolePermissions.fulfilled, (state, { payload }) => {
                state.rolePermissions[payload.role] = payload.permissions;
                state.isLoading = false;
            })
            .addCase(fetchRolePermissions.rejected, (state, { payload }) => {
                state.error = payload;
                state.isLoading = false;
            });
    }
});

export default roleSlice.reducer;