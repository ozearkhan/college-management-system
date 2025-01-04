// backend/models/roleModel.js
const db = require('../config/database');
const { ROLES, PERMISSIONS } = require('../config/rbac');

class RoleModel {
    static async createRole(roleName, description) {
        const [result] = await db.query(
            'INSERT INTO roles (name, description) VALUES (?, ?)',
            [roleName, description]
        );
        return result.insertId;
    }

    static async assignPermissionToRole(roleId, permissionId) {
        const [result] = await db.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
            [roleId, permissionId]
        );
        return result.insertId;
    }

    static async getRolePermissions(roleName) {
        const [permissions] = await db.query(`
            SELECT p.name 
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            JOIN roles r ON r.id = rp.role_id
            WHERE r.name = ?
        `, [roleName]);

        return permissions.map(p => p.name);
    }

    static async getAllRoles() {
        const [roles] = await db.query('SELECT * FROM roles');
        return roles;
    }

    static async getAllPermissions() {
        const [permissions] = await db.query('SELECT * FROM permissions');
        return permissions;
    }

    static async getRolePermissionsFromDB(roleName) {
        const [permissions] = await db.query(`
            SELECT p.name 
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            JOIN roles r ON r.id = rp.role_id
            WHERE r.name = ?
        `, [roleName]);
        
        return permissions.map(p => p.name);
    }
}

module.exports = RoleModel;