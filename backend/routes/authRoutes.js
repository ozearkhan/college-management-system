// Update authRoutes to use validation
const express = require('express');
const AuthController = require('../controllers/authController');
const {
    validateRegistration,
    handleValidationErrors
} = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post(
    '/register',
    validateRegistration,
    handleValidationErrors,
    AuthController.register
);

router.post('/login', AuthController.login);

module.exports = router;