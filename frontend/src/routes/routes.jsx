// routes/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import UserList from '../components/users/UserList';
import ProtectedRoute from './ProtectedRoute';
import UserForm from "@/components/users/UserForm.jsx";
import Dashboard from "@/components/dashboard/Dashboard.jsx";
import RoleManagement from "@/components/roles/RoleManagement.jsx";
import UserPermissions from "@/components/users/UserPermissions.jsx";
import PermissionGate from '@/components/auth/PermissionGate';

// Updated routes.jsx
export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'users',
                children: [
                    { 
                        index: true, 
                        element: (
                            <PermissionGate requiredPermissions={['READ_USER']}>
                                <UserList />
                            </PermissionGate>
                        )
                    },
                    { 
                        path: 'new', 
                        element: (
                            <PermissionGate requiredPermissions={['CREATE_USER']}>
                                <UserForm />
                            </PermissionGate>
                        )
                    },
                    { 
                        path: 'edit/:id', 
                        element: (
                            <PermissionGate requiredPermissions={['UPDATE_USER']}>
                                <UserForm />
                            </PermissionGate>
                        )
                    },
                    { 
                        path: ':id/permissions', 
                        element: (
                            <PermissionGate requiredPermissions={['READ_USER']}>
                                <UserPermissions />
                            </PermissionGate>
                        )
                    }
                ]
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'roles',
                element: (
                    <PermissionGate 
                        requiredPermissions={['CREATE_USER', 'UPDATE_USER', 'DELETE_USER']}
                    >
                        <RoleManagement />
                    </PermissionGate>
                )
            }
        ]
    },
    {
        path: '/login',
        element: <LoginForm />
    },
    {
        path: '/register',
        element: <RegisterForm />
    }
]);