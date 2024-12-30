// routes/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
    const { user } = useSelector(state => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If permissions are required, check them
    if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every(permission =>
            user.permissions?.includes(permission)
        );
        
        if (!hasPermission) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;