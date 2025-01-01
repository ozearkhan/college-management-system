// components/auth/PermissionGate.jsx
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import axiosInstance from '@/lib/axios';
import { API_BASE_URL } from '@/config/api';

const PermissionGate = ({ children, requiredPermissions }) => {
    const { user } = useSelector(state => state.auth);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (!user?.role) return;
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/roles/${user.role}/permissions`);
                setPermissions(response.data.permissions);
            } catch (err) {
                console.error('Error fetching permissions:', err);
            }
        };
        fetchPermissions();
    }, [user?.role]);

    // Check if user has all required permissions
    const hasPermissions = Array.isArray(requiredPermissions)
        ? requiredPermissions.every(permission => permissions.includes(permission))
        : permissions.includes(requiredPermissions);

    if (!hasPermissions) {
        return null;
    }

    return children;
};

export default PermissionGate;