// backend/middlewares/rbacMiddleware.js
const { ROLE_PERMISSIONS } = require('../config/rbac');

const rbacMiddleware = (requiredPermissions) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        const hasPermission = requiredPermissions.every(permission =>
            ROLE_PERMISSIONS[userRole]?.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

module.exports = rbacMiddleware;