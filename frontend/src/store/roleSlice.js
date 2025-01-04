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

export const createRole = createAsyncThunk(
    'roles/createRole',
    async (roleData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/roles`, roleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create role');
        }
    }
);

export const updateRole = createAsyncThunk(
    'roles/updateRole',
    async ({ roleId, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/roles/${roleId}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update role');
        }
    }
);

export const assignPermissions = createAsyncThunk(
    'roles/assignPermissions',
    async ({ roleId, permissions }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/roles/${roleId}/permissions`,
                { permissions }
            );
            return { roleId, permissions: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to assign permissions');
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
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
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
            })
            .addCase(createRole.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRole.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createRole.rejected, (state, { payload }) => {
                state.error = payload;
                state.isLoading = false;
            })
            .addCase(updateRole.fulfilled, (state, { payload }) => {
                state.isLoading = false;
            })
            .addCase(assignPermissions.fulfilled, (state, { payload }) => {
                state.rolePermissions[payload.roleId] = payload.permissions;
            });
    }
});

export const { clearError } = roleSlice.actions;
export default roleSlice.reducer;