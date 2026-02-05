#!/bin/bash

# Task Management API Test Script
# This script demonstrates all API endpoints

BASE_URL="http://localhost:3000"
BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BOLD}${BLUE}================================${NC}"
echo -e "${BOLD}${BLUE}Task Management API Test Suite${NC}"
echo -e "${BOLD}${BLUE}================================${NC}\n"

# Health Check
echo -e "${BOLD}1. Health Check${NC}"
curl -s "$BASE_URL/health" | jq .
echo -e "\n"

# Register User
echo -e "${BOLD}2. Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }')

echo "$REGISTER_RESPONSE" | jq .

# Extract token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token saved: ${TOKEN:0:20}...${NC}\n"

# Login
echo -e "${BOLD}3. Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')
if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}Login successful${NC}\n"
else
  echo -e "${RED}Login failed - using registration token${NC}\n"
  TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
fi

# Get Current User
echo -e "${BOLD}4. Get Current User${NC}"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n"

# Create Task 1
echo -e "${BOLD}5. Create Task (Pending)${NC}"
TASK1_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Complete Assignment 4",
    "description": "Build a secure RESTful Task Management API with authentication and authorization",
    "status": "pending"
  }')

echo "$TASK1_RESPONSE" | jq .
TASK1_ID=$(echo "$TASK1_RESPONSE" | jq -r '.data.task._id')
echo -e "${GREEN}Task ID saved: $TASK1_ID${NC}\n"

# Create Task 2
echo -e "${BOLD}6. Create Task (In Progress)${NC}"
curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Implement authentication",
    "description": "Add JWT-based authentication with bcrypt password hashing and rate limiting",
    "status": "in-progress"
  }' | jq .
echo -e "\n"

# Create Task 3
echo -e "${BOLD}7. Create Task (Completed)${NC}"
curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Setup MongoDB",
    "description": "Configure MongoDB connection and create necessary indexes",
    "status": "completed"
  }' | jq .
echo -e "\n"

# Get All Tasks
echo -e "${BOLD}8. Get All Tasks${NC}"
curl -s -X GET "$BASE_URL/tasks" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n"

# Get Tasks by Status
echo -e "${BOLD}9. Get Pending Tasks${NC}"
curl -s -X GET "$BASE_URL/tasks?status=pending" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n"

# Get Task by ID
echo -e "${BOLD}10. Get Task by ID${NC}"
curl -s -X GET "$BASE_URL/tasks/$TASK1_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n"

# Update Task Status
echo -e "${BOLD}11. Update Task Status to 'in-progress'${NC}"
curl -s -X PATCH "$BASE_URL/tasks/$TASK1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "in-progress"
  }' | jq .
echo -e "\n"

# Update Full Task
echo -e "${BOLD}12. Update Full Task${NC}"
curl -s -X PUT "$BASE_URL/tasks/$TASK1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Complete Assignment 4 - Updated",
    "description": "Build and document a secure RESTful Task Management API",
    "status": "completed"
  }' | jq .
echo -e "\n"

# Error Tests
echo -e "${BOLD}${RED}=== ERROR SCENARIOS ===${NC}\n"

# Invalid Credentials
echo -e "${BOLD}13. Login with Invalid Credentials${NC}"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }' | jq .
echo -e "\n"

# Validation Error
echo -e "${BOLD}14. Create Task with Validation Error${NC}"
curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Ab",
    "description": "Short"
  }' | jq .
echo -e "\n"

# Unauthorized Access
echo -e "${BOLD}15. Access Protected Route without Token${NC}"
curl -s -X GET "$BASE_URL/tasks" | jq .
echo -e "\n"

# Delete Task
echo -e "${BOLD}16. Delete Task${NC}"
curl -s -X DELETE "$BASE_URL/tasks/$TASK1_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n"

# Logout
echo -e "${BOLD}17. Logout${NC}"
curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n"

echo -e "${BOLD}${GREEN}================================${NC}"
echo -e "${BOLD}${GREEN}All tests completed!${NC}"
echo -e "${BOLD}${GREEN}================================${NC}"
