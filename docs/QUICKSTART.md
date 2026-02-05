# Quick Start Guide

Get the Task Management API up and running in 5 minutes!

## Prerequisites

- Node.js (v18+) installed
- MongoDB installed OR Docker installed
- Git (to clone the repository)

## Option 1: Quick Start with Docker (Recommended)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd task-management-api
cp .env.example .env
```

### 2. Start Everything with Docker
```bash
docker-compose up --build
```

### 3. Test the API
```bash
# In a new terminal
curl http://localhost:3000/health
```

**That's it!** Your API is running at `http://localhost:3000`

---

## Option 2: Manual Setup (Without Docker)

### 1. Clone Repository
```bash
git clone <repository-url>
cd task-management-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env if needed (default values work for local MongoDB)
```

### 4. Start MongoDB
```bash
# If MongoDB is installed as a service
sudo service mongod start

# OR run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 5. Start the API
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

### 6. Verify It's Working
```bash
curl http://localhost:3000/health
```

---

## Testing the API

### Method 1: Using the Test Script

```bash
# Make script executable (first time only)
chmod +x test-api.sh

# Run all tests
./test-api.sh
```

### Method 2: Using Postman

1. Open Postman
2. Import collection: `postman/Task-Management-API.postman_collection.json`
3. Import environment: `postman/Task-Management-API.postman_environment.json`
4. Run requests in order:
   - Register User
   - Login
   - Create Task
   - Get All Tasks
   - etc.

### Method 3: Manual cURL Commands

#### 1. Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

#### 2. Create a Task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task for the API"
  }'
```

#### 3. Get All Tasks
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
- Make sure MongoDB is running
- Check `MONGO_URI` in `.env` file
- For Docker: Use `mongodb://mongo:27017/task_management`
- For local: Use `mongodb://localhost:27017/task_management`

### Issue: "Port 3000 already in use"
**Solution:**
- Change `PORT` in `.env` to another port (e.g., 3001)
- Or stop the process using port 3000

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot import Postman collection"
**Solution:**
- Make sure you're using Postman v10+
- Import as "Collection v2.1"
- Set the environment after importing

---

## Next Steps

1. ✅ Read full documentation: `README.md`
2. ✅ Study API endpoints: `docs/API.md`
3. ✅ Prepare for oral defense: `docs/ORAL_DEFENSE.md`
4. ✅ Test all endpoints with Postman
5. ✅ Understand the security measures
6. ✅ Review the code structure

---

## Project Structure Overview

```
task-management-api/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth, validation, error handling
│   ├── models/         # Database models (User, Task)
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── server.js       # Entry point
├── docs/               # Documentation
├── postman/            # Postman collection
├── .env.example        # Environment template
├── Dockerfile          # Docker configuration
└── docker-compose.yml  # Docker Compose setup
```

---

## API Endpoints Quick Reference

### Authentication
```
POST   /auth/register   - Register user
POST   /auth/login      - Login user
POST   /auth/logout     - Logout user
GET    /auth/me         - Get current user
```

### Tasks
```
POST   /tasks           - Create task
GET    /tasks           - Get all user tasks
GET    /tasks/:id       - Get specific task
PATCH  /tasks/:id       - Update task status
PUT    /tasks/:id       - Update entire task
DELETE /tasks/:id       - Delete task
```

### Other
```
GET    /health          - Health check
```

---

## Environment Variables

Essential variables in `.env`:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

---

## Need Help?

1. Check `README.md` for detailed documentation
2. Check `docs/API.md` for endpoint details
3. Check `docs/ORAL_DEFENSE.md` for conceptual questions
4. Review the code - it's well-commented!

---

## Development Tips

### Watch Logs
```bash
# If using Docker
docker-compose logs -f api

# If running locally
# Logs appear in terminal where you ran npm run dev
```

### Restart Services
```bash
# Docker
docker-compose restart

# Local
# Just save any file (nodemon will auto-reload)
```

### Check MongoDB Data
```bash
# Connect to MongoDB
docker exec -it task_management_mongodb mongosh

# Or if local
mongosh

# View databases
show dbs

# Use task_management database
use task_management

# View collections
show collections

# View users
db.users.find()

# View tasks
db.tasks.find()
```

---

**You're all set! 🚀**

The API should be running and ready for testing. Good luck with your assignment!
