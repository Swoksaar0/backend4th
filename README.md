# Task Management API

A secure RESTful API for managing tasks with user authentication, authorization, and role-based access control built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Security Measures](#security-measures)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## ✨ Features

- ✅ **CRUD Operations** for tasks with validation
- 🔐 **User Authentication** (Register, Login, Logout)
- 🛡️ **Authorization** with role-based access control (User & Admin)
- 🔒 **Secure Password Storage** using bcrypt hashing
- 🎟️ **JWT-based Authentication**
- ⚡ **Rate Limiting** to prevent brute-force attacks
- 🧹 **Input Validation & Sanitization** against injection attacks
- 🐳 **Docker Support** for easy deployment
- 📝 **Comprehensive Error Handling**

## 🛠 Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Native Driver)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, XSS-Clean, Express-Mongo-Sanitize
- **Rate Limiting**: Express-Rate-Limit

## 🔒 Security Measures

### 1. **Password Security**
- Passwords are hashed using bcrypt with configurable salt rounds (default: 10)
- Plain text passwords are never stored in the database
- Password validation enforces minimum length requirements

### 2. **Authentication & Authorization**
- JWT tokens for stateless authentication
- Tokens expire after configurable period (default: 7 days)
- Middleware enforces authentication on protected routes
- Role-based access control (User vs Admin)
- Ownership checks prevent users from modifying others' tasks

### 3. **Rate Limiting**
- General API rate limit: 100 requests per 15 minutes
- Auth endpoints rate limit: 5 attempts per 15 minutes
- Task creation rate limit: 10 tasks per minute
- Helps prevent brute-force and DDoS attacks

### 4. **Input Validation & Sanitization**
- Server-side validation using Joi schemas
- NoSQL injection prevention with express-mongo-sanitize
- XSS attack prevention with xss-clean
- Request payload size limits

### 5. **Secure Headers**
- Helmet.js sets security-related HTTP headers
- CORS configured for cross-origin requests
- Generic error messages to prevent information leakage

### 6. **Error Handling**
- Generic error messages in production
- Detailed errors only in development mode
- No sensitive data exposure in API responses

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # Using MongoDB service
   sudo service mongod start
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify the API is running**
   ```bash
   curl http://localhost:3000/health
   ```

### Docker Deployment

1. **Using Docker Compose** (Recommended)
   ```bash
   docker-compose up --build
   ```

2. **Using Docker manually**
   ```bash
   # Build the image
   docker build -t task-management-api .
   
   # Run the container
   docker run -p 3000:3000 --env-file .env task-management-api
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional, defaults to "user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f123...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-02-05T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "status": "pending"  // optional: pending, in-progress, completed
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "65f456...",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API docs",
      "status": "pending",
      "userId": "65f123...",
      "createdAt": "2024-02-05T10:30:00.000Z",
      "updatedAt": "2024-02-05T10:30:00.000Z"
    }
  }
}
```

#### Get All Tasks
```http
GET /tasks
Authorization: Bearer <token>

# Optional query parameters:
GET /tasks?status=pending
```

#### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task Status
```http
PATCH /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Update Task (Full Update)
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

#### Unauthorized (401)
```json
{
  "success": false,
  "message": "No token provided. Please login."
}
```

#### Forbidden (403)
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

#### Not Found (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

#### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

## 🧪 Testing

### Using Postman Collection

1. Import the Postman collection from `postman/Task-Management-API.postman_collection.json`
2. Import the environment from `postman/Task-Management-API.postman_environment.json`
3. Run the requests in order:
   - Register a user
   - Login (token will be saved automatically)
   - Create tasks
   - Get, update, delete tasks

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'

# Login (save the token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create task (replace TOKEN)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Task","description":"This is a test task"}'

# Get all tasks
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 📁 Project Structure

```
task-management-api/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── taskController.js    # Task CRUD operations
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization
│   │   ├── errorHandler.js      # Global error handling
│   │   └── rateLimiter.js       # Rate limiting configuration
│   ├── models/
│   │   ├── User.js              # User model & methods
│   │   └── Task.js              # Task model & methods
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   └── taskRoutes.js        # Task routes
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   ├── response.js          # Response helpers
│   │   └── validation.js        # Joi validation schemas
│   └── server.js                # Application entry point
├── docs/
│   └── API.md                   # Detailed API documentation
├── postman/
│   ├── collection.json          # Postman collection
│   └── environment.json         # Postman environment
├── .env.example                 # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Docker image definition
├── docker-compose.yml          # Docker Compose configuration
├── package.json                # NPM dependencies & scripts
└── README.md                   # This file
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/task_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

### Important Notes:
- Change `JWT_SECRET` to a strong random string in production
- Use environment-specific MongoDB URIs
- Adjust rate limits based on your requirements
- Never commit `.env` file to version control

## 🚢 Deployment

### Prerequisites for Production

1. **Set NODE_ENV to production**
   ```env
   NODE_ENV=production
   ```

2. **Use strong JWT secret**
   ```bash
   # Generate a secure random string
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Configure MongoDB connection string for production**

4. **Enable HTTPS** (JWT tokens should only be transmitted over HTTPS)

### Docker Production Deployment

```bash
# Build production image
docker build -t task-management-api:latest .

# Run with production environment
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGO_URI=mongodb://your-mongodb-url \
  -e JWT_SECRET=your-production-secret \
  --name task-api \
  task-management-api:latest
```

## 📝 Assignment Checklist

- ✅ RESTful API design with standard HTTP methods
- ✅ CRUD operations for tasks
- ✅ MongoDB native driver (no Mongoose)
- ✅ User registration and login
- ✅ Secure password storage with bcrypt
- ✅ JWT-based authentication
- ✅ Role-based authorization (user & admin)
- ✅ Ownership checks for task operations
- ✅ Input validation (Joi)
- ✅ Rate limiting on auth endpoints
- ✅ XSS and NoSQL injection prevention
- ✅ Proper error handling
- ✅ Consistent JSON responses
- ✅ Comprehensive documentation
- ✅ Postman collection
- ✅ Dockerfile
- ✅ Docker Compose configuration

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run linter
npm run lint

# Format code
npm run format
```

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact [your-email@example.com]
