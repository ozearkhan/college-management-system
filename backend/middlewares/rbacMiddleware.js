const rbac = require('../config/rbac');

const rbacMiddleware = (requiredPermissions) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;

            // Get the dynamically loaded role permissions
            const rolePermissions = rbac.getRolePermissions();

            // Check if the user has all the required permissions
            const hasPermission = requiredPermissions.every(permission =>
                rolePermissions[userRole]?.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Error in RBAC middleware:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = rbacMiddleware;
