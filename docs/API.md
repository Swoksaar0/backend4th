# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]  // Optional, for validation errors
}
```

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"  // Optional: "user" or "admin", defaults to "user"
}
```

**Validation Rules:**
- `username`: 3-30 alphanumeric characters, required
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required
- `role`: Either "user" or "admin", optional

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-02-05T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed or user already exists
- `429 Too Many Requests`: Rate limit exceeded (5 attempts per 15 minutes)

---

### 2. Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Too many login attempts

**Security Notes:**
- Returns generic "Invalid credentials" message for both wrong email and wrong password
- Rate limited to prevent brute-force attacks
- Passwords are verified using bcrypt

---

### 3. Logout

Invalidate the current session (client-side token removal for JWT).

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
- `401 Unauthorized`: No token or invalid token

---

### 4. Get Current User

Retrieve the profile of the currently authenticated user.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-02-05T10:00:00.000Z",
      "updatedAt": "2024-02-05T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: No token or invalid token

---

## Task Endpoints

### 1. Create Task

Create a new task for the authenticated user.

**Endpoint:** `POST /tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API documentation for the task management system",
  "status": "pending"  // Optional: "pending", "in-progress", "completed"
}
```

**Validation Rules:**
- `title`: 3-200 characters, required
- `description`: 10-2000 characters, required
- `status`: One of ["pending", "in-progress", "completed"], optional

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "65f4567890abcdef12345678",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API documentation...",
      "status": "pending",
      "userId": "65f1234567890abcdef12345",
      "createdAt": "2024-02-05T10:30:00.000Z",
      "updatedAt": "2024-02-05T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Not authenticated
- `429 Too Many Requests`: Created too many tasks (10 per minute limit)

---

### 2. Get All Tasks

Retrieve all tasks created by the authenticated user.

**Endpoint:** `GET /tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status ("pending", "in-progress", "completed")

**Examples:**
```
GET /tasks
GET /tasks?status=pending
GET /tasks?status=completed
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "65f4567890abcdef12345678",
        "title": "Complete project documentation",
        "description": "Write comprehensive README...",
        "status": "pending",
        "userId": "65f1234567890abcdef12345",
        "createdAt": "2024-02-05T10:30:00.000Z",
        "updatedAt": "2024-02-05T10:30:00.000Z"
      },
      {
        "_id": "65f7890abcdef1234567890a",
        "title": "Implement authentication",
        "description": "Add JWT-based authentication...",
        "status": "completed",
        "userId": "65f1234567890abcdef12345",
        "createdAt": "2024-02-04T09:00:00.000Z",
        "updatedAt": "2024-02-05T11:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated

---

### 3. Get Task by ID

Retrieve a specific task by its ID.

**Endpoint:** `GET /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Task ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "_id": "65f4567890abcdef12345678",
      "title": "Complete project documentation",
      "description": "Write comprehensive README...",
      "status": "pending",
      "userId": "65f1234567890abcdef12345",
      "createdAt": "2024-02-05T10:30:00.000Z",
      "updatedAt": "2024-02-05T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the task owner and not an admin
- `404 Not Found`: Task not found

**Authorization:**
- Users can only view their own tasks
- Admins can view any task

---

### 4. Update Task Status (Partial Update)

Update only the status of a task.

**Endpoint:** `PATCH /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Validation Rules:**
- `status`: Must be one of ["pending", "in-progress", "completed"], required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "task": {
      "_id": "65f4567890abcdef12345678",
      "title": "Complete project documentation",
      "description": "Write comprehensive README...",
      "status": "completed",
      "userId": "65f1234567890abcdef12345",
      "createdAt": "2024-02-05T10:30:00.000Z",
      "updatedAt": "2024-02-05T15:45:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid status value
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the task owner and not an admin
- `404 Not Found`: Task not found

---

### 5. Update Task (Full Update)

Update task title, description, and/or status.

**Endpoint:** `PUT /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description with more details",
  "status": "in-progress"
}
```

**Validation Rules:**
- At least one field must be provided
- `title`: 3-200 characters (optional)
- `description`: 10-2000 characters (optional)
- `status`: One of ["pending", "in-progress", "completed"] (optional)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "65f4567890abcdef12345678",
      "title": "Updated title",
      "description": "Updated description with more details",
      "status": "in-progress",
      "userId": "65f1234567890abcdef12345",
      "createdAt": "2024-02-05T10:30:00.000Z",
      "updatedAt": "2024-02-05T16:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed or no fields provided
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the task owner and not an admin
- `404 Not Found`: Task not found

---

### 6. Delete Task

Delete a task permanently.

**Endpoint:** `DELETE /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the task owner and not an admin
- `404 Not Found`: Task not found

**Authorization:**
- Only the task owner can delete the task
- Admin users can delete any task

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or malformed request |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Authenticated but not authorized |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests per 15 minutes |
| POST /auth/register | 5 requests per 15 minutes |
| POST /auth/login | 5 requests per 15 minutes |
| POST /tasks | 10 requests per minute |

---

## Common Error Examples

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters long"
    },
    {
      "field": "description",
      "message": "Description is required"
    }
  ]
}
```

### Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Please login."
}
```

### Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Rate Limit
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes"
}
```

---

## Testing Workflow

1. **Register a new user**
   ```bash
   POST /auth/register
   ```

2. **Login and save the token**
   ```bash
   POST /auth/login
   ```

3. **Create tasks using the token**
   ```bash
   POST /tasks
   Authorization: Bearer <token>
   ```

4. **Retrieve all tasks**
   ```bash
   GET /tasks
   Authorization: Bearer <token>
   ```

5. **Update task status**
   ```bash
   PATCH /tasks/:id
   Authorization: Bearer <token>
   ```

6. **Delete task**
   ```bash
   DELETE /tasks/:id
   Authorization: Bearer <token>
   ```

---

## Security Best Practices

1. **Always use HTTPS in production** - JWT tokens should never be transmitted over HTTP
2. **Store tokens securely** - Use httpOnly cookies or secure storage
3. **Never expose tokens in URLs** - Always use headers
4. **Implement token refresh** - For long-lived applications
5. **Validate all inputs** - Never trust client data
6. **Use environment variables** - Never hardcode secrets
