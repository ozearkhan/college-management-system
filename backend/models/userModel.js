// backend/models/userModel.js
const db = require('../config/database');
const { hashPassword } = require('../utils/passwordUtils');

class UserModel {
    static async createUser(userData) {
        const { username, email, password, role } = userData;
        const hashedPassword = await hashPassword(password);

        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );

        return result.insertId;
    }

    // New method to find all users
    static async findAllUsers() {
        return db.query('SELECT id, username, email, role, created_at FROM users');
    }

    static async findUserByEmail(email) {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return users[0];
    }

    static async findUserById(id) {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return users[0];
    }

    // Update user method
    static async updateUser(userId, userData) {
        const { username, email, role } = userData;

        const [result] = await db.query(
            'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
            [username, email, role, userId]
        );

        return result.affectedRows > 0
            ? await this.findUserById(userId)
            : null;
    }

    // Delete user method
    static async deleteUser(userId) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = UserModel;