export const API_BASE_URL = 'http://localhost:5000/api';

export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register'
    },
    users: {
        list: '/users',
        single: (id) => `/users/${id}`,
        permissions: (id) => `/users/${id}/permissions`
    },
    roles: {
        list: '/roles',
        permissions: (role) => `/roles/${role}/permissions`
    }
}; 