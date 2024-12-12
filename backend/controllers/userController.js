// backend/controllers/userController.js
const UserModel = require('../models/userModel');
const { PERMISSIONS } = require('../config/rbac');

class UserController {
    // Get all users (requires READ_USER permission)
    static async getAllUsers(req, res) {
        try {
            const [users] = await UserModel.findAllUsers();

            // Remove sensitive information
            const sanitizedUsers = users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }));

            res.json(sanitizedUsers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get user by ID (requires READ_USER permission)
    static async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserModel.findUserById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Remove sensitive information
            const sanitizedUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            };

            res.json(sanitizedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update user (requires UPDATE_USER permission)
    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { username, email, role } = req.body;

            // Validate input
            if (!username || !email || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const updatedUser = await UserModel.updateUser(userId, {
                username,
                email,
                role
            });

            res.json({
                message: 'User updated successfully',
                user: updatedUser
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete user (requires DELETE_USER permission)
    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            const deletedUser = await UserModel.deleteUser(userId);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;