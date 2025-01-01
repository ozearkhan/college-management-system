// backend/routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getRoles, getRolePermissions } = require('../controllers/roleController');

// Public route for getting roles (needed for registration)
router.get('/', getRoles);

// Protected routes
router.get('/:role/permissions', authMiddleware, getRolePermissions);

module.exports = router;