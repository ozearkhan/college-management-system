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
                    { index: true, element: <UserList /> },
                    { path: 'new', element: <UserForm /> },
                    { path: 'edit/:id', element: <UserForm /> },
                    { path: ':id/permissions', element: <UserPermissions /> }
                ]
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'roles',
                element: <RoleManagement />
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