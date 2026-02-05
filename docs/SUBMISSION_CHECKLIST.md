# Assignment Submission Checklist

Use this checklist to ensure you've completed all requirements before submitting.

## ✅ Technical Implementation (50%)

### Tasks CRUD & MongoDB (20%)

- [ ] **POST /tasks** - Create task endpoint works
  - [ ] Requires authentication
  - [ ] Validates title and description
  - [ ] Saves to MongoDB with createdAt and updatedAt
  - [ ] Returns 201 status code
  
- [ ] **GET /tasks** - Get all user tasks
  - [ ] Requires authentication
  - [ ] Returns only logged-in user's tasks
  - [ ] Supports filtering by status (query param)
  - [ ] Returns 200 status code
  
- [ ] **GET /tasks/:id** - Get specific task
  - [ ] Requires authentication
  - [ ] Validates ObjectId format
  - [ ] Checks ownership or admin role
  - [ ] Returns 404 if not found
  
- [ ] **PATCH /tasks/:id** - Update task status
  - [ ] Requires authentication
  - [ ] Validates status value
  - [ ] Checks ownership or admin role
  - [ ] Updates updatedAt timestamp
  
- [ ] **DELETE /tasks/:id** - Delete task
  - [ ] Requires authentication
  - [ ] Checks ownership or admin role
  - [ ] Returns 200 on success
  
- [ ] **MongoDB Native Driver**
  - [ ] No Mongoose or other ODM
  - [ ] Using native methods: insertOne, findOne, updateOne, deleteOne
  - [ ] Connection in `src/config/database.js`
  
- [ ] **Database Indexes**
  - [ ] Created for users (email, username)
  - [ ] Created for tasks (userId, createdAt, status)

### Authentication & Security (15%)

- [ ] **POST /auth/register**
  - [ ] Validates username, email, password
  - [ ] Email and username are unique
  - [ ] Password hashed with bcrypt
  - [ ] Returns JWT token
  - [ ] Rate limited (5 per 15 min)
  
- [ ] **POST /auth/login**
  - [ ] Validates email and password
  - [ ] Generic error message ("Invalid credentials")
  - [ ] Compares hashed passwords
  - [ ] Returns JWT token
  - [ ] Rate limited (5 per 15 min)
  
- [ ] **POST /auth/logout**
  - [ ] Requires authentication
  - [ ] Returns success response
  
- [ ] **GET /auth/me**
  - [ ] Requires authentication
  - [ ] Returns current user data
  - [ ] Doesn't return password
  
- [ ] **Password Security**
  - [ ] Using bcrypt with salt rounds
  - [ ] Plain text passwords never stored
  - [ ] Configured via environment variable
  
- [ ] **Rate Limiting**
  - [ ] General API: 100/15min
  - [ ] Auth endpoints: 5/15min
  - [ ] Task creation: 10/min
  - [ ] Returns 429 status when exceeded

### Authorization & RBAC (10%)

- [ ] **User Roles**
  - [ ] Two roles implemented: user and admin
  - [ ] Role stored in User model
  - [ ] Role included in JWT payload
  
- [ ] **Ownership Checks**
  - [ ] Users can only modify their own tasks
  - [ ] Admin can modify any task
  - [ ] Checked in update and delete operations
  - [ ] Returns 403 Forbidden when denied
  
- [ ] **Authentication Middleware**
  - [ ] Verifies JWT token
  - [ ] Attaches user to request
  - [ ] Returns 401 if no token or invalid
  
- [ ] **Authorization Middleware**
  - [ ] Checks user role
  - [ ] Can restrict to specific roles
  - [ ] Used in protected routes

### Documentation & Packaging (5%)

- [ ] **README.md**
  - [ ] Installation instructions
  - [ ] Environment variables documented
  - [ ] Endpoint list with examples
  - [ ] Authentication flow explained
  - [ ] Security measures described
  
- [ ] **API Documentation** (docs/API.md)
  - [ ] All endpoints documented
  - [ ] Request/response examples
  - [ ] Status codes explained
  - [ ] Error responses shown
  
- [ ] **Postman/Insomnia Collection**
  - [ ] All endpoints included
  - [ ] Environment variables set up
  - [ ] Automatic token saving
  - [ ] Examples for success and error cases
  
- [ ] **Dockerfile**
  - [ ] Builds successfully
  - [ ] Uses production dependencies
  - [ ] Health check configured
  - [ ] Exposes correct port
  
- [ ] **docker-compose.yml**
  - [ ] API and MongoDB services
  - [ ] Environment variables configured
  - [ ] Networks and volumes set up
  - [ ] Runs without errors

---

## ✅ Oral Defense Preparation (50%)

### Code Walkthrough (20%)

- [ ] Can explain any file in the project
- [ ] Know where authentication logic is
- [ ] Can explain password hashing
- [ ] Understand JWT generation/verification
- [ ] Know how rate limiting works
- [ ] Can explain database models
- [ ] Understand middleware flow
- [ ] Know how validation works

### Conceptual Knowledge (15%)

- [ ] **REST Principles**
  - [ ] Can explain stateless communication
  - [ ] Know standard HTTP methods
  - [ ] Understand resource-based URLs
  - [ ] Can explain status codes
  
- [ ] **JWT**
  - [ ] Know what JWT contains
  - [ ] Understand how it's verified
  - [ ] Can explain vs sessions
  - [ ] Know security considerations
  
- [ ] **NoSQL**
  - [ ] Can explain document model
  - [ ] Know difference from SQL
  - [ ] Understand when to use MongoDB
  - [ ] Can explain indexing
  
- [ ] **Security Principles**
  - [ ] Password hashing with bcrypt
  - [ ] Rate limiting purpose
  - [ ] XSS prevention
  - [ ] NoSQL injection prevention
  - [ ] Input validation importance

### Live Debugging/Task (15%)

Be ready to:
- [ ] Add a new field to task model
- [ ] Create a new endpoint
- [ ] Modify validation rules
- [ ] Change rate limit values
- [ ] Fix a simulated bug
- [ ] Add a new middleware
- [ ] Test an endpoint with Postman/cURL

---

## 🔍 Pre-Submission Tests

### Functional Tests

```bash
# 1. Health check works
curl http://localhost:3000/health
# Expected: {"status":"ok",...}

# 2. Registration works
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
# Expected: 201, returns token

# 3. Login works
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
# Expected: 200, returns token

# 4. Create task works (replace TOKEN)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test","description":"Test description"}'
# Expected: 201, returns task

# 5. Get tasks works
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer TOKEN"
# Expected: 200, returns tasks array
```

### Error Handling Tests

```bash
# 1. Validation error
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Ab"}'
# Expected: 400, validation errors

# 2. Unauthorized access
curl -X GET http://localhost:3000/tasks
# Expected: 401, unauthorized

# 3. Wrong password
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
# Expected: 401, invalid credentials

# 4. Task not found
curl -X GET http://localhost:3000/tasks/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer TOKEN"
# Expected: 404, not found
```

### Docker Tests

```bash
# 1. Build succeeds
docker build -t task-api .
# Expected: No errors

# 2. Compose starts
docker-compose up --build
# Expected: Both services running

# 3. API accessible
curl http://localhost:3000/health
# Expected: {"status":"ok",...}

# 4. MongoDB accessible
docker exec -it task_management_mongodb mongosh
# Expected: MongoDB shell opens
```

---

## 📋 Final Checks

### Code Quality

- [ ] No console.logs except in proper logging
- [ ] No commented-out code
- [ ] No TODO comments left
- [ ] Consistent code style
- [ ] Meaningful variable names
- [ ] Functions are small and focused
- [ ] Comments where needed

### Security

- [ ] .env file not committed
- [ ] .env.example provided
- [ ] JWT_SECRET is strong
- [ ] Passwords never logged
- [ ] Error messages don't leak info
- [ ] All inputs validated
- [ ] All database queries sanitized

### Documentation

- [ ] README is clear and complete
- [ ] All endpoints documented
- [ ] Setup instructions work
- [ ] Environment variables explained
- [ ] Security measures listed
- [ ] No typos or formatting issues

### Files to Submit

- [ ] Source code (entire project)
- [ ] README.md
- [ ] docs/API.md
- [ ] Postman collection
- [ ] Postman environment
- [ ] Dockerfile
- [ ] docker-compose.yml
- [ ] .env.example (NOT .env)

---

## 🎯 Assignment Grading Breakdown

| Category | Points | Status |
|----------|--------|--------|
| **Tasks CRUD & MongoDB** | 20% | [ ] |
| **Auth & Security** | 15% | [ ] |
| **Authorization & RBAC** | 10% | [ ] |
| **Documentation & Packaging** | 5% | [ ] |
| **Code Walkthrough** | 20% | [ ] |
| **Conceptual Knowledge** | 15% | [ ] |
| **Live Debugging/Task** | 15% | [ ] |
| **TOTAL** | **100%** | [ ] |

---

## 🚀 Before You Submit

1. [ ] Run the test script: `./test-api.sh`
2. [ ] Test with Postman collection
3. [ ] Build and test with Docker
4. [ ] Review all documentation
5. [ ] Practice explaining your code
6. [ ] Prepare for live coding task
7. [ ] Get a good night's sleep! 😴

---

## 📚 Quick Reference for Defense

**Main Files to Know:**
- `src/server.js` - Application entry point
- `src/config/database.js` - MongoDB connection
- `src/models/User.js` - User model & bcrypt
- `src/models/Task.js` - Task model & queries
- `src/middleware/auth.js` - Authentication logic
- `src/utils/validation.js` - Input validation
- `src/middleware/rateLimiter.js` - Rate limiting

**Key Concepts:**
- REST: Stateless, resource-based, HTTP methods
- JWT: Payload, signature, verification
- bcrypt: Salt rounds, hashing, comparison
- RBAC: Roles (user/admin), permissions
- MongoDB: Documents, collections, indexes

**Security Measures:**
1. Password hashing (bcrypt)
2. JWT authentication
3. Rate limiting
4. Input validation
5. XSS prevention
6. NoSQL injection prevention
7. Ownership checks
8. Generic error messages

---

**Good luck! 🎓**

You've got this! The code is solid, well-documented, and follows all requirements.
