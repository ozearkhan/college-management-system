// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeRBAC } = require('./config/rbac');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// Start server function
const startServer = async () => {
    try {
        console.log('Initializing RBAC...');
        await initializeRBAC();
        console.log('RBAC initialized successfully.');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1); 
    }
};

// Start the server
startServer();
