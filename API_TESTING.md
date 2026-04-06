# API Testing Guide

## Base URL
```
http://localhost:8080/api
```

## Testing Workflow

### Step 1: Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-04-04T10:30:00"
}
```

Save the user ID (e.g., 1) for subsequent requests.

### Step 2: Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Step 3: Create Categories
```bash
# Category 1: Food & Dining
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "name": "Food & Dining"
  }'

# Category 2: Transport
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "name": "Transport"
  }'

# Category 3: Entertainment
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "name": "Entertainment"
  }'
```

Save the category IDs for creating expenses.

### Step 4: Get All Categories
```bash
curl -X GET http://localhost:8080/api/categories \
  -H "X-User-Id: 1"
```

### Step 5: Create Expenses
```bash
# Expense 1
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "amount": 25.50,
    "description": "Lunch at restaurant",
    "expenseDate": "2026-04-04",
    "categoryId": 1
  }'

# Expense 2
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "amount": 10.00,
    "description": "Taxi fare",
    "expenseDate": "2026-04-03",
    "categoryId": 2
  }'

# Expense 3
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "amount": 15.00,
    "description": "Movie ticket",
    "expenseDate": "2026-04-02",
    "categoryId": 3
  }'
```

### Step 6: Get All Expenses
```bash
curl -X GET http://localhost:8080/api/expenses \
  -H "X-User-Id: 1"
```

### Step 7: Get Expenses with Filters
```bash
# Filter by month
curl -X GET "http://localhost:8080/api/expenses?month=2026-04" \
  -H "X-User-Id: 1"

# Filter by category
curl -X GET "http://localhost:8080/api/expenses?categoryId=1" \
  -H "X-User-Id: 1"

# Filter by month and category
curl -X GET "http://localhost:8080/api/expenses?month=2026-04&categoryId=1" \
  -H "X-User-Id: 1"
```

### Step 8: Get Specific Expense
```bash
curl -X GET http://localhost:8080/api/expenses/1 \
  -H "X-User-Id: 1"
```

### Step 9: Update Expense
```bash
curl -X PUT http://localhost:8080/api/expenses/1 \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "amount": 30.00,
    "description": "Lunch at restaurant (updated)",
    "expenseDate": "2026-04-04",
    "categoryId": 1
  }'
```

### Step 10: Create Budgets
```bash
# Budget for Food category in April
curl -X POST http://localhost:8080/api/budgets \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "monthlyLimit": 500.00,
    "month": "2026-04",
    "categoryId": 1
  }'

# Budget for Transport category in April
curl -X POST http://localhost:8080/api/budgets \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "monthlyLimit": 200.00,
    "month": "2026-04",
    "categoryId": 2
  }'
```

### Step 11: Get All Budgets
```bash
curl -X GET http://localhost:8080/api/budgets \
  -H "X-User-Id: 1"
```

### Step 12: Get Budgets by Month
```bash
curl -X GET http://localhost:8080/api/budgets/month/2026-04 \
  -H "X-User-Id: 1"
```

### Step 13: Get Specific Budget
```bash
curl -X GET http://localhost:8080/api/budgets/1 \
  -H "X-User-Id: 1"
```

### Step 14: Update Budget
```bash
curl -X PUT http://localhost:8080/api/budgets/1 \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "monthlyLimit": 600.00,
    "month": "2026-04",
    "categoryId": 1
  }'
```

### Step 15: Delete Operations

#### Delete Expense
```bash
curl -X DELETE http://localhost:8080/api/expenses/1 \
  -H "X-User-Id: 1"
```

#### Delete Budget
```bash
curl -X DELETE http://localhost:8080/api/budgets/1 \
  -H "X-User-Id: 1"
```

#### Delete Category
```bash
curl -X DELETE http://localhost:8080/api/categories/1 \
  -H "X-User-Id: 1"
```

### Step 16: Health Check
```bash
curl -X GET http://localhost:8080/api/health
```

## Sample Response with Validation Errors

If you send invalid data:
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "amount": -10,
    "description": "",
    "expenseDate": "2026-05-05",
    "categoryId": 1
  }'
```

**Response (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "amount": "Amount must be greater than 0",
    "description": "Description cannot be empty",
    "expenseDate": "Expense date cannot be in the future"
  },
  "timestamp": "2026-04-04T10:30:00",
  "path": "/api/expenses"
}
```

## Common Error Responses

### 404 Not Found
```json
{
  "status": 404,
  "message": "Expense not found with id: 999",
  "error": "Resource Not Found",
  "timestamp": "2026-04-04T10:30:00",
  "path": "/api/expenses/999"
}
```

### 409 Conflict
```json
{
  "status": 409,
  "message": "Category already exists with this name",
  "error": "Duplicate Resource",
  "timestamp": "2026-04-04T10:30:00",
  "path": "/api/categories"
}
```

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Amount must be greater than 0",
  "error": "Invalid Input",
  "timestamp": "2026-04-04T10:30:00",
  "path": "/api/expenses"
}
```

## Using Postman

Import this as a Postman collection:

1. Create a new collection "Expense Tracker"
2. Create environment variables:
   - `BASE_URL`: http://localhost:8080/api
   - `USER_ID`: 1 (update after registration)

3. Add requests with these variables:
   - URL: `{{BASE_URL}}/endpoint`
   - Header: `X-User-Id: {{USER_ID}}`

## Notes

- All timestamp fields are in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
- User ID header (`X-User-Id`) is required for protected endpoints
- In production, replace with JWT or OAuth authentication
- Passwords are hashed using BCrypt
- Amounts are handled as BigDecimal for financial accuracy

