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
        const [roles] = await db.query(`
            SELECT DISTINCT r.id, r.name, r.description
            FROM roles r
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.id
        `);
        return roles;
    }

    static async getAllPermissions() {
        const [permissions] = await db.query('SELECT * FROM permissions');
        return permissions;
    }

    static async getRolePermissionsFromDB(roleName) {
        const [permissions] = await db.query(`
            SELECT DISTINCT p.name 
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            JOIN roles r ON r.id = rp.role_id
            WHERE r.name = ?
        `, [roleName]);
        
        return permissions.map(p => p.name);
    }

    static async updateRole(roleId, { name, description }) {
        const [result] = await db.query(
            'UPDATE roles SET name = ?, description = ? WHERE id = ?',
            [name, description, roleId]
        );
        return result.affectedRows > 0;
    }

    static async deleteRole(roleId) {
        // First delete role permissions
        await db.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
        // Then delete role
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [roleId]);
        return result.affectedRows > 0;
    }

    static async removePermissionFromRole(roleId, permissionId) {
        await db.query(
            'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?',
            [roleId, permissionId]
        );
    }

    static async removeAllPermissions(roleId) {
        await db.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
    }
}

module.exports = RoleModel;