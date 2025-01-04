// backend/config/rbac.js
const RoleModel = require('../models/roleModel');

// RBAC structures
let ROLES = {};
let PERMISSIONS = {};
let ROLE_PERMISSIONS = {};

const initializeRBAC = async () => {
    try {
        console.log('Initializing RBAC from database...');

        const roles = await RoleModel.getAllRoles();
        ROLES = roles.reduce((acc, role) => {
            acc[role.name] = role.name;
            return acc;
        }, {});

        const permissions = await RoleModel.getAllPermissions();
        PERMISSIONS = permissions.reduce((acc, perm) => {
            acc[perm.name] = perm.name;
            return acc;
        }, {});

        for (const role of roles) {
            const rolePerms = await RoleModel.getRolePermissionsFromDB(role.name);
            ROLE_PERMISSIONS[role.name] = rolePerms.map((perm) => perm.name);
        }

        console.log('RBAC initialized successfully.');
    } catch (error) {
        console.error('Error initializing RBAC from database:', error);
        
        // Fallback static configuration
        PERMISSIONS = {
            CREATE_USER: 'CREATE_USER',
            READ_USER: 'READ_USER',
            UPDATE_USER: 'UPDATE_USER',
            DELETE_USER: 'DELETE_USER',
            MANAGE_COURSES: 'MANAGE_COURSES',
            MANAGE_ROLES: 'MANAGE_ROLES'
        };

        ROLES = {
            ADMIN: 'ADMIN',
            STUDENT: 'STUDENT',
            TEACHER: 'TEACHER'
        };

        ROLE_PERMISSIONS = {
            [ROLES.ADMIN]: Object.values(PERMISSIONS),
            [ROLES.TEACHER]: [PERMISSIONS.READ_USER, PERMISSIONS.MANAGE_COURSES],
            [ROLES.STUDENT]: [PERMISSIONS.READ_USER]
        };
    }
};

module.exports = {
    initializeRBAC,
    getRoles: () => ROLES,
    getPermissions: () => PERMISSIONS,
    getRolePermissions: () => ROLE_PERMISSIONS,
    PERMISSIONS: () => PERMISSIONS
};
