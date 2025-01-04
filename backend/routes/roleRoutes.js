// backend/routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');
const RoleController = require('../controllers/roleController');

// Public route for getting roles (needed for registration)
router.get('/', RoleController.getRoles);

// Protected routes
router.get('/:role/permissions', authMiddleware, RoleController.getRolePermissions);

// New RBAC management routes (admin only)
router.use(authMiddleware);
router.use(rbacMiddleware(['MANAGE_ROLES']));

router.post('/', RoleController.createRole);
router.put('/:roleId', RoleController.updateRole);
router.delete('/:roleId', RoleController.deleteRole);
router.post('/:roleId/permissions', RoleController.assignPermissions);
router.delete('/:roleId/permissions/:permissionId', RoleController.removePermission);

module.exports = router;