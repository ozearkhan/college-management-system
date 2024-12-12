// backend/controllers/roleController.js
const { ROLES, PERMISSIONS, ROLE_PERMISSIONS } = require('../config/rbac');

class RoleController {
    // Get all available roles
    static getRoles(req, res) {
        try {
            const rolesWithPermissions = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
                role,
                permissions
            }));

            res.json(rolesWithPermissions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get permissions for a specific role
    static getRolePermissions(req, res) {
        try {
            const { role } = req.params;

            // Validate role
            if (!Object.values(ROLES).includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }

            const permissions = ROLE_PERMISSIONS[role] || [];

            res.json({
                role,
                permissions
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RoleController;