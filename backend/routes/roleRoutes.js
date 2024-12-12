// backend/routes/roleRoutes.js
const express = require('express');
const RoleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET all roles with their permissions
router.get('/',
    authMiddleware,
    RoleController.getRoles
);

// GET permissions for a specific role
router.get('/:role/permissions',
    authMiddleware,
    RoleController.getRolePermissions
);

module.exports = router;