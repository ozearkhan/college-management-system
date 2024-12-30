// components/auth/PermissionGate.jsx
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import axiosInstance from '@/lib/axios';
import { API_BASE_URL } from '@/config/api';

const PermissionGate = ({ children, requiredPermission }) => {
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

    if (!permissions.includes(requiredPermission)) {
        return null;
    }

    return children;
};

export default PermissionGate;