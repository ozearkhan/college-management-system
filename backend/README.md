# Student Management System API Documentation

## Authentication Endpoints

### Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Validation:**
    - Username: min 3 chars, alphanumeric + underscore
    - Password: min 8 chars, must include uppercase, lowercase, number, special char
    - Email: valid email format
    - Role: must be one of valid roles
- **Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "STUDENT"
}

```

- **Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token"
}

```

### Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}

```

- **Response (200):**

```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}

```

---

## User Management

### Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Auth:** Required (Bearer Token)
- **Permission:** `READ_USER`
- **Response (200):**

```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "created_at": "2024-01-01T00:00:00Z"
  }
]

```

### Create User

- **URL:** `/api/users`
- **Method:** `POST`
- **Auth:** Required (Bearer Token)
- **Permission:** `CREATE_USER`
- **Request Body:**

```json
{
  "username": "new_user",
  "email": "new@example.com",
  "password": "Password123!",
  "role": "STUDENT"
}

```

### Update User

- **URL:** `/api/users/:id`
- **Method:** `PUT`
- **Auth:** Required (Bearer Token)
- **Permission:** `UPDATE_USER`
- **Request Body:**

```json
{
  "username": "updated_user",
  "email": "updated@example.com",
  "role": "TEACHER"
}

```

### Delete User

- **URL:** `/api/users/:id`
- **Method:** `DELETE`
- **Auth:** Required (Bearer Token)
- **Permission:** `DELETE_USER`

---

## Role Management

### Get All Roles

- **URL:** `/api/roles`
- **Method:** `GET`
- **Auth:** Required (Bearer Token)

### Create Role

- **URL:** `/api/roles`
- **Method:** `POST`
- **Auth:** Required (Bearer Token)
- **Permission:** `MANAGE_ROLES`
- **Request Body:**

```json
{
  "name": "NEW_ROLE",
  "description": "Description of the new role"
}

```

### Update Role

- **URL:** `/api/roles/:roleId`
- **Method:** `PUT`
- **Auth:** Required (Bearer Token)
- **Permission:** `MANAGE_ROLES`

### Assign Permissions

- **URL:** `/api/roles/:roleId/permissions`
- **Method:** `POST`
- **Auth:** Required (Bearer Token)
- **Permission:** `MANAGE_ROLES`
- **Request Body:**

```json
{
  "permissions": ["CREATE_USER", "READ_USER"]
}

```

### Remove Permission

- **URL:** `/api/roles/:roleId/permissions/:permissionId`
- **Method:** `DELETE`
- **Auth:** Required (Bearer Token)
- **Permission:** `MANAGE_ROLES`

---

## Database Schema

### Tables Structure

### Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

```

### Roles Table

```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### Permissions Table

```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### Role_Permissions Table

```sql
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

```

### Entity Relationship Diagram

```
Users (1) -----> (1) Roles (M) -----> (N) Permissions

```

---

## RBAC Implementation

### Overview

The Role-Based Access Control (RBAC) system is implemented using a dynamic permission loading system that supports runtime updates.

### Key Components

1. **RBAC Configuration (`config/rbac.js`)**
    - Manages role and permission caching
    - Provides methods for accessing role permissions
    - Supports dynamic reloading of permissions
2. **RBAC Middleware (`middlewares/rbacMiddleware.js`)**
    - Validates user permissions for protected routes
    - Checks against cached role permissions
    - Supports multiple permission requirements

### Permission Loading Flow

1. Server startup triggers `initializeRBAC()`
2. Permissions are loaded from database
3. Cached in memory for performance
4. Reloaded when roles/permissions are updated

### Usage Example

```jsx
// Protecting a route with RBAC
router.post('/users',
    authMiddleware,
    rbacMiddleware(['CREATE_USER']),
    UserController.createUser
);

```

### Default Roles and Permissions

### Roles

- `ADMIN`: Full system access
- `TEACHER`: Limited management access
- `STUDENT`: Basic access

### Permissions

- `CREATE_USER`
- `READ_USER`
- `UPDATE_USER`
- `DELETE_USER`
- `MANAGE_ROLES`
- `MANAGE_COURSES`

---

## Environment Configuration

### Required Environment Variables

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1h

```

---

## Security Considerations

1. **Password Security**
    - Passwords are hashed using bcrypt
    - Salt rounds: 10 (configurable)
    - Minimum password requirements enforced
2. **JWT Token Management**
    - Tokens expire after 1 hour
    - Secure token storage recommendations
    - Token blacklisting support
3. **Input Validation**
    - Request validation using express-validator
    - Sanitization of user inputs
    - SQL injection prevention
4. **General Security**
    - CORS configuration
    - XSS protection
    - Request size limits

---

## Error Handling

### Standard Error Response Format

```json
{
    "error": "Error message",
    "details": {}, // Optional additional details
    "code": "ERROR_CODE" // Optional error code
}

```

### Validation Error Format

```json
{
    "errors": [
        {
            "field": "username",
            "message": "Username must be at least 3 characters long"
        }
    ]
}

```

### Common Error Codes

- `401`: Authentication required/failed
- `403`: Insufficient permissions
- `404`: Resource not found
- `422`: Validation error
- `500`: Internal server error

### Error Handling Implementation

```jsx
// Example of error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message,
        details: err.details
    });
});

```

## Development Setup

### Local Development

1. **Clone the Repository**

```bash
git clone <repository-url>
cd backend

```

1. **Install Dependencies**

```bash
npm install

```

1. **Set Up Environment**

```bash
cp .env.example .env
# Edit .env with your local configuration

```

1. **Database Setup**

```bash
# Create database
mysql -u root -p
CREATE DATABASE student_management;

# Run migrations
npm run migrate

# Seed initial data
npm run seed

```

1. **Start Development Server**

```bash
npm run dev

```

### Database Migrations

### Initial Schema Migration

```sql
-- Create initial tables
-- users, roles, permissions, role_permissions tables...

-- Seed default roles
INSERT INTO roles (name, description) VALUES
('ADMIN', 'System administrator'),
('TEACHER', 'Teacher role'),
('STUDENT', 'Student role');

-- Seed default permissions
INSERT INTO permissions (name) VALUES
('CREATE_USER'),
('READ_USER'),
('UPDATE_USER'),
('DELETE_USER'),
('MANAGE_ROLES'),
('MANAGE_COURSES');

```

## Deployment

### Production Setup

1. **Environment Configuration**

```bash
# Set production environment variables
NODE_ENV=production
PORT=5000

```

1. **Database Configuration**
- Use connection pooling
- Set appropriate pool size
- Configure SSL for database connection
1. **Security Measures**
- Enable HTTPS
- Set secure headers
- Configure CORS appropriately

### Production Start Script

```bash
# Build and start
npm run build
npm start

```

### Deployment Checklist

- [ ]  Set production environment variables
- [ ]  Configure SSL/TLS
- [ ]  Set up database backups
- [ ]  Configure logging
- [ ]  Set up monitoring
- [ ]  Configure reverse proxy (e.g., Nginx)

## API Testing

### Postman Collection

A Postman collection is available at `/docs/postman/student-management-api.json`

### Example Test Cases

### Authentication Tests

```jsx
// Login test
POST /api/auth/login
{
    "email": "test@example.com",
    "password": "Password123!"
}

// Expected: 200 OK with token

```

### User Management Tests

```jsx
// Create user test
POST /api/users
Authorization: Bearer <token>
{
    "username": "test_user",
    "email": "test@example.com",
    "password": "Password123!",
    "role": "STUDENT"
}

// Expected: 201 Created

```

## Middleware Documentation

### Authentication Middleware

```jsx
// authMiddleware.js
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    // ... token verification logic
};

```

### RBAC Middleware

```jsx
// rbacMiddleware.js
const rbacMiddleware = (requiredPermissions) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const rolePermissions = rbac.getRolePermissions();
        // ... permission checking logic
    };
};

```

### Validation Middleware

```jsx
// validationMiddleware.js
const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .matches(/^[a-zA-Z0-9_]+$/),
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])/)
];

```

### Custom Error Handling

```jsx
// errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

```