# Oral Defense Preparation Guide

## Code Walkthrough Questions & Answers

### 1. Authentication & Security

**Q: Explain how password hashing works in your application.**
**A:** 
- Passwords are hashed using bcrypt with configurable salt rounds (default: 10)
- Location: `src/models/User.js` - `User.create()` method
- Process:
  1. User provides plain text password during registration
  2. bcrypt generates a random salt
  3. Password is hashed with the salt
  4. Only the hash is stored in database
  5. During login, `bcrypt.compare()` verifies the password

**Q: How does JWT authentication work?**
**A:**
- Location: `src/utils/jwt.js` and `src/middleware/auth.js`
- Process:
  1. User logs in with email/password
  2. Server verifies credentials
  3. Server generates JWT with payload: `{ userId, role }`
  4. Token is sent to client
  5. Client includes token in `Authorization: Bearer <token>` header
  6. Middleware `authenticate()` verifies token on each request
  7. User info attached to `req.user` for use in controllers

**Q: What rate limiting strategies did you implement?**
**A:**
- General API: 100 requests per 15 minutes (`src/middleware/rateLimiter.js`)
- Auth endpoints: 5 attempts per 15 minutes (prevents brute-force)
- Task creation: 10 tasks per minute
- Uses `express-rate-limit` library
- Configured in `src/middleware/rateLimiter.js`

### 2. Authorization & Access Control

**Q: Explain your RBAC implementation.**
**A:**
- Two roles: `user` and `admin`
- Role stored in User model: `src/models/User.js`
- Middleware `authorize()` checks role: `src/middleware/auth.js`
- Example usage in routes: `authorize('admin')`

**Q: How do you enforce ownership checks?**
**A:**
- Location: `src/controllers/taskController.js`
- Every update/delete operation checks:
  ```javascript
  const isOwner = task.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return sendForbidden(res, 'Permission denied');
  }
  ```
- Only task owner or admin can modify/delete tasks

### 3. Database Operations

**Q: Why use native MongoDB driver instead of Mongoose?**
**A:**
- Assignment requirement: no ODM/ORM
- Native driver gives more control
- Direct database operations:
  - `insertOne()`, `findOne()`, `updateOne()`, `deleteOne()`
  - Location: `src/models/User.js` and `src/models/Task.js`

**Q: Explain your MongoDB indexing strategy.**
**A:**
- Location: `src/config/database.js` - `createIndexes()`
- Indexes created:
  - `users.email` - unique index for fast login lookup
  - `users.username` - unique index
  - `tasks.userId` - for efficient user task queries
  - `tasks.createdAt` - for sorting
  - `tasks.status` - for filtering

**Q: How do you prevent NoSQL injection?**
**A:**
- `express-mongo-sanitize` middleware removes `$` and `.` from user input
- Location: `src/server.js` - `app.use(mongoSanitize())`
- ObjectId validation before queries
- Joi validation prevents malicious input

### 4. Validation & Error Handling

**Q: Describe your input validation approach.**
**A:**
- Using Joi library for schema validation
- Location: `src/utils/validation.js`
- Validation middleware: `validate(schema)`
- Applied to routes before controllers
- Example schemas:
  - `registerSchema` - validates user registration
  - `createTaskSchema` - validates task creation
  - Checks: required fields, min/max length, allowed values

**Q: How does global error handling work?**
**A:**
- Location: `src/middleware/errorHandler.js`
- Express error middleware catches all errors
- Process:
  1. Errors passed to `next(error)`
  2. `errorHandler()` middleware catches them
  3. Determines appropriate status code
  4. Returns consistent JSON response
  5. In production: hides stack traces
  6. In development: shows detailed errors

### 5. REST API Design

**Q: Explain your RESTful endpoint design.**
**A:**
- Standard HTTP methods:
  - `GET /tasks` - retrieve all tasks
  - `POST /tasks` - create task
  - `GET /tasks/:id` - get specific task
  - `PATCH /tasks/:id` - partial update (status only)
  - `PUT /tasks/:id` - full update
  - `DELETE /tasks/:id` - delete task
- Proper status codes:
  - 200 OK, 201 Created, 400 Bad Request
  - 401 Unauthorized, 403 Forbidden, 404 Not Found
  - 429 Too Many Requests

**Q: What makes your API responses consistent?**
**A:**
- Location: `src/utils/response.js`
- Helper functions:
  - `sendSuccess()`, `sendError()`, `sendCreated()`
  - `sendNotFound()`, `sendUnauthorized()`, `sendForbidden()`
- All responses have: `{ success, message, data/errors }`

### 6. Security Measures

**Q: List all security measures implemented.**
**A:**
1. **Password Security**: bcrypt hashing
2. **Authentication**: JWT tokens
3. **Authorization**: RBAC + ownership checks
4. **Rate Limiting**: Prevent brute-force attacks
5. **Input Validation**: Joi schemas
6. **XSS Prevention**: xss-clean middleware
7. **NoSQL Injection Prevention**: express-mongo-sanitize
8. **Secure Headers**: Helmet.js
9. **CORS**: Configured with cors middleware
10. **Generic Error Messages**: No info leakage
11. **Request Size Limits**: Prevent payload attacks

**Q: How do you prevent account enumeration?**
**A:**
- Generic error messages for login
- Both wrong email and wrong password return: "Invalid credentials"
- Location: `src/controllers/authController.js` - `login()` method
- No information about whether email exists

### 7. Docker & Deployment

**Q: Explain your Docker setup.**
**A:**
- `Dockerfile`: Multi-stage build, production dependencies only
- `docker-compose.yml`: Two services (API + MongoDB)
- Health checks configured
- Environment variables for configuration
- Data persistence with volumes

**Q: What environment variables are critical?**
**A:**
- `JWT_SECRET`: Must be strong random string in production
- `MONGO_URI`: Database connection string
- `NODE_ENV`: Controls error verbosity
- `BCRYPT_ROUNDS`: Hash complexity
- Rate limit configurations

## Live Debugging Tasks

### Task 1: Add a new validation rule
```javascript
// In src/utils/validation.js
// Add priority field to createTaskSchema
priority: Joi.string()
  .valid('low', 'medium', 'high')
  .default('medium')
```

### Task 2: Change rate limit for task creation
```javascript
// In src/middleware/rateLimiter.js
const createTaskLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // Changed from 10 to 5
  // ...
});
```

### Task 3: Add a new endpoint - Get task count
```javascript
// In src/controllers/taskController.js
const getTaskCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tasks = await Task.findAll(userId);
  
  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
  
  sendSuccess(res, 200, { counts }, 'Task counts retrieved');
});

// In src/routes/taskRoutes.js
router.get('/count', authenticate, taskController.getTaskCount);
```

## Conceptual Questions

### REST Principles
- **Stateless**: Each request contains all necessary info (JWT)
- **Resource-based**: URLs represent resources (/tasks, /auth)
- **HTTP Methods**: GET (read), POST (create), PUT/PATCH (update), DELETE
- **Status Codes**: Meaningful responses (200, 201, 400, 401, 403, 404, 429)

### JWT vs Sessions
- **JWT**: Stateless, scalable, stored client-side, includes claims
- **Sessions**: Stateful, stored server-side, requires session store
- **Choice**: JWT for RESTful API - easier to scale, no server state

### NoSQL vs SQL
- **NoSQL (MongoDB)**: 
  - Flexible schema
  - Document-based
  - Horizontal scaling
  - Good for: unstructured data, rapid development
- **SQL**:
  - Rigid schema
  - Relations with joins
  - ACID transactions
  - Good for: complex relations, data integrity

### Security Principles
1. **Defense in Depth**: Multiple security layers
2. **Least Privilege**: Users/roles have minimum necessary permissions
3. **Fail Securely**: Errors don't expose sensitive info
4. **Don't Trust Input**: Validate and sanitize everything
5. **Secure by Default**: Opt-in for insecure features

## Common Mistakes to Avoid

1. ❌ Storing passwords in plain text
   ✅ Always hash with bcrypt

2. ❌ Exposing error details in production
   ✅ Use generic messages, log details server-side

3. ❌ Not validating ObjectId format
   ✅ Use `ObjectId.isValid()` before queries

4. ❌ Allowing any user to modify any task
   ✅ Check ownership or admin role

5. ❌ Hardcoding secrets in code
   ✅ Use environment variables

## Tips for Demonstration

1. **Be confident**: You built this, you know it
2. **Explain clearly**: Use simple language
3. **Show code**: Navigate confidently through files
4. **Test live**: Run requests, show responses
5. **Admit if unsure**: Better than making up answers
6. **Connect concepts**: Link code to theory
7. **Highlight security**: Emphasize security measures
