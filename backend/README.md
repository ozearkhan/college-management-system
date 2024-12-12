# Student Management System API Documentation

## Authentication Endpoints

### 1. Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Request Body:**

```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT"
}

```

- **Roles:** `ADMIN`, `STUDENT`, `TEACHER`
- **Response:**
    - Success: `201 Created`

    ```json
    {
      "message": "User registered successfully",
      "token": "jwt_token"
    }
    
    ```

    - Error: `400 Bad Request` (User exists)
    - Error: `500 Internal Server Error`

### 2. Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**

```json
{
    "email": "john@example.com",
    "password": "password123"
}

```

- **Response:**
    - Success: `200 OK`

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

    - Error: `401 Unauthorized`
    - Error: `500 Internal Server Error`

## User Management Endpoints

### 3. Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Permissions Required:** `READ_USER`
- **Response:**

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

- **Possible Errors:**
    - `401 Unauthorized` (No/Invalid Token)
    - `403 Forbidden` (Insufficient Permissions)
    - `500 Internal Server Error`

### 4. Get User by ID

- **URL:** `/api/users/:id`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Permissions Required:** `READ_USER`
- **Response:**

    ```json
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "created_at": "2024-01-01T00:00:00Z"
    }
    
    ```

- **Possible Errors:**
    - `401 Unauthorized`
    - `403 Forbidden`
    - `404 Not Found`
    - `500 Internal Server Error`

### 5. Update User

- **URL:** `/api/users/:id`
- **Method:** `PUT`
- **Authentication:** Required (Bearer Token)
- **Permissions Required:** `UPDATE_USER`
- **Request Body:**

```json
{
    "username": "john_updated",
    "email": "john_updated@example.com",
    "role": "TEACHER"
}

```

- **Response:**

    ```json
    {
      "message": "User updated successfully",
      "user": {
          "id": 1,
          "username": "john_updated",
          "email": "john_updated@example.com",
          "role": "TEACHER"
      }
    }
    
    ```

- **Possible Errors:**
    - `400 Bad Request` (Invalid Input)
    - `401 Unauthorized`
    - `403 Forbidden`
    - `404 Not Found`
    - `500 Internal Server Error`

### 6. Delete User

- **URL:** `/api/users/:id`
- **Method:** `DELETE`
- **Authentication:** Required (Bearer Token)
- **Permissions Required:** `DELETE_USER`
- **Response:**

    ```json
    {
      "message": "User deleted successfully"
    }
    
    ```

- **Possible Errors:**
    - `401 Unauthorized`
    - `403 Forbidden`
    - `404 Not Found`
    - `500 Internal Server Error`

## Role Management Endpoints

### 7. Get All Roles

- **URL:** `/api/roles`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Response:**

    ```json
    [
      {
        "role": "ADMIN",
        "permissions": [
          "CREATE_USER",
          "READ_USER",
          "UPDATE_USER",
          "DELETE_USER",
          "MANAGE_COURSES"
        ]
      },
      // Other roles...
    ]
    
    ```

- **Possible Errors:**
    - `401 Unauthorized`
    - `500 Internal Server Error`

### 8. Get Role Permissions

- **URL:** `/api/roles/:role/permissions`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Response:**

    ```json
    {
      "role": "ADMIN",
      "permissions": [
        "CREATE_USER",
        "READ_USER",
        "UPDATE_USER",
        "DELETE_USER",
      ]
    }
    
    ```

- **Possible Errors:**
    - `400 Bad Request` (Invalid Role)
    - `401 Unauthorized`
    - `500 Internal Server Error`

## Roles and Permissions

### Available Roles

- `ADMIN`
- `STUDENT`
- `TEACHER`

### Available Permissions

- `CREATE_USER`
- `READ_USER`
- `UPDATE_USER`
- `DELETE_USER`

## Authentication

- JWT tokens are used for authentication
- Token is valid for 1 hour
- Include token in `Authorization` header as `Bearer <token>`

## Error Handling

- Consistent error response format
- Descriptive error messages
- Appropriate HTTP status codes