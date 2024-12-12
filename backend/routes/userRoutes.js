// backend/routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');
const { PERMISSIONS } = require('../config/rbac');

const router = express.Router();

// GET all users (requires READ_USER permission)
router.get('/',
    authMiddleware,
    rbacMiddleware([PERMISSIONS.READ_USER]),
    UserController.getAllUsers
);

// GET user by ID (requires READ_USER permission)
router.get('/:id',
    authMiddleware,
    rbacMiddleware([PERMISSIONS.READ_USER]),
    UserController.getUserById
);

// UPDATE user (requires UPDATE_USER permission)
router.put('/:id',
    authMiddleware,
    rbacMiddleware([PERMISSIONS.UPDATE_USER]),
    UserController.updateUser
);

// DELETE user (requires DELETE_USER permission)
router.delete('/:id',
    authMiddleware,
    rbacMiddleware([PERMISSIONS.DELETE_USER]),
    UserController.deleteUser
);

module.exports = router;