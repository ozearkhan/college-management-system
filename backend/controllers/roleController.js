// backend/controllers/roleController.js
const RoleModel = require('../models/roleModel');
const { initializeRBAC } = require('../config/rbac');

class RoleController {
    static async getRoles(req, res) {
        try {
            const roles = await RoleModel.getAllRoles();
            console.log('Fetched roles:', roles);
            res.json(roles.map(role => ({ role: role.name })));
        } catch (error) {
            console.error('Error in getRoles:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getRolePermissions(req, res) {
        try {
            const { role } = req.params;
            const permissions = await RoleModel.getRolePermissionsFromDB(role);
            console.log('Fetched permissions for role:', role, permissions);
            res.json({ permissions });
        } catch (error) {
            console.error('Error in getRolePermissions:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async createRole(req, res) {
        try {
            const { name, description, permissions } = req.body;
            const roleId = await RoleModel.createRole(name, description);
            
            if (permissions && permissions.length > 0) {
                await Promise.all(permissions.map(permId => 
                    RoleModel.assignPermissionToRole(roleId, permId)
                ));
            }

            await initializeRBAC();
            res.status(201).json({ message: 'Role created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRole(req, res) {
        try {
            const { roleId } = req.params;
            const { name, description } = req.body;
            await RoleModel.updateRole(roleId, { name, description });
            await initializeRBAC();
            res.json({ message: 'Role updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteRole(req, res) {
        try {
            const { roleId } = req.params;
            await RoleModel.deleteRole(roleId);
            await initializeRBAC();
            res.json({ message: 'Role deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async assignPermissions(req, res) {
        try {
            const { roleId } = req.params;
            const { permissions } = req.body;
            
            // First remove existing permissions
            await RoleModel.removeAllPermissions(roleId);
            
            // Then assign new permissions
            await Promise.all(permissions.map(permId => 
                RoleModel.assignPermissionToRole(roleId, permId)
            ));
            
            await initializeRBAC();
            res.json({ message: 'Permissions assigned successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async removePermission(req, res) {
        try {
            const { roleId, permissionId } = req.params;
            await RoleModel.removePermissionFromRole(roleId, permissionId);
            await initializeRBAC();
            res.json({ message: 'Permission removed successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RoleController;