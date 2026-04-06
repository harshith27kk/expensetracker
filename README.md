# Expense Tracker Application

A comprehensive Spring Boot REST API for managing personal expenses, categories, and budgets with PostgreSQL database.

## Technology Stack

- **Java 25**
- **Spring Boot 4.0.5**
- **Spring Data JPA**
- **PostgreSQL**
- **Gradle**
- **Lombok**
- **Spring Security (Password Encoding)**

## Project Structure

```
expensetracker/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/expensetracker/
│   │   │       ├── controller/        # REST API Controllers
│   │   │       ├── service/           # Business Logic
│   │   │       ├── repository/        # Data Access Layer
│   │   │       ├── entity/            # JPA Entities
│   │   │       ├── dto/               # Data Transfer Objects
│   │   │       ├── exception/         # Custom Exceptions
│   │   │       └── util/              # Utility Classes
│   │   └── resources/
│   │       └── application.properties # Configuration
│   └── test/
│       └── java/                      # Test Classes
├── build.gradle                        # Gradle Build Configuration
└── README.md                           # This file
```

## Setup Instructions

### Prerequisites

- Java 25 or higher
- PostgreSQL 12 or higher
- Gradle 8.0 or higher

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE expensetracker_db;
```

2. Update database credentials in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expensetracker_db
spring.datasource.username=postgres
spring.datasource.password=password
```

### Build and Run

1. Navigate to project directory:
```bash
cd expensetracker
```

2. Build the project:
```bash
./gradlew clean build
```

3. Run the application:
```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication APIs

#### Register User
- **URL:** `POST /api/auth/register`
- **Description:** Register a new user account
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-04-04T10:30:00"
}
```

#### Login User
- **URL:** `POST /api/auth/login`
- **Description:** Authenticate user and get user details
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-04-04T10:30:00"
}
```

### Category APIs

#### Create Category
- **URL:** `POST /api/categories`
- **Headers:** `X-User-Id: 1`
- **Description:** Create a new category
- **Request Body:**
```json
{
  "name": "Food & Dining"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "Food & Dining",
  "userId": 1,
  "createdAt": "2026-04-04T10:30:00"
}
```

#### Get All Categories
- **URL:** `GET /api/categories`
- **Headers:** `X-User-Id: 1`
- **Description:** Retrieve all categories for the user
- **Response:**
```json
[
  {
    "id": 1,
    "name": "Food & Dining",
    "userId": 1,
    "createdAt": "2026-04-04T10:30:00"
  }
]
```

#### Get Category by ID
- **URL:** `GET /api/categories/{id}`
- **Headers:** `X-User-Id: 1`
- **Description:** Get specific category details
- **Response:**
```json
{
  "id": 1,
  "name": "Food & Dining",
  "userId": 1,
  "createdAt": "2026-04-04T10:30:00"
}
```

#### Update Category
- **URL:** `PUT /api/categories/{id}`
- **Headers:** `X-User-Id: 1`
- **Request Body:**
```json
{
  "name": "Food & Dining Updated"
}
```
- **Response:** Updated category object

#### Delete Category
- **URL:** `DELETE /api/categories/{id}`
- **Headers:** `X-User-Id: 1`
- **Response:** `204 No Content`

### Expense APIs

#### Create Expense
- **URL:** `POST /api/expenses`
- **Headers:** `X-User-Id: 1`
- **Description:** Create a new expense
- **Request Body:**
```json
{
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "expenseDate": "2026-04-04",
  "categoryId": 1
}
```
- **Response:**
```json
{
  "id": 1,
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "expenseDate": "2026-04-04",
  "categoryId": 1,
  "categoryName": "Food & Dining",
  "userId": 1,
  "createdAt": "2026-04-04T10:30:00",
  "updatedAt": "2026-04-04T10:30:00"
}
```

#### Get All Expenses
- **URL:** `GET /api/expenses`
- **Headers:** `X-User-Id: 1`
- **Query Parameters:**
  - `month` (optional): Filter by month (format: YYYY-MM, e.g., "2026-04")
  - `categoryId` (optional): Filter by category ID
- **Examples:**
  - `GET /api/expenses` - All expenses
  - `GET /api/expenses?month=2026-04` - Expenses in April 2026
  - `GET /api/expenses?categoryId=1` - Expenses in category 1
  - `GET /api/expenses?month=2026-04&categoryId=1` - Expenses in April 2026 for category 1

#### Get Expense by ID
- **URL:** `GET /api/expenses/{id}`
- **Headers:** `X-User-Id: 1`
- **Response:** Expense object

#### Update Expense
- **URL:** `PUT /api/expenses/{id}`
- **Headers:** `X-User-Id: 1`
- **Request Body:**
```json
{
  "amount": 30.00,
  "description": "Updated lunch",
  "expenseDate": "2026-04-04",
  "categoryId": 1
}
```
- **Response:** Updated expense object

#### Delete Expense
- **URL:** `DELETE /api/expenses/{id}`
- **Headers:** `X-User-Id: 1`
- **Response:** `204 No Content`

### Budget APIs

#### Create Budget
- **URL:** `POST /api/budgets`
- **Headers:** `X-User-Id: 1`
- **Description:** Set a monthly budget limit for a category
- **Request Body:**
```json
{
  "monthlyLimit": 500.00,
  "month": "2026-04",
  "categoryId": 1
}
```
- **Response:**
```json
{
  "id": 1,
  "monthlyLimit": 500.00,
  "month": "2026-04",
  "categoryId": 1,
  "categoryName": "Food & Dining",
  "userId": 1,
  "createdAt": "2026-04-04T10:30:00",
  "updatedAt": "2026-04-04T10:30:00"
}
```

#### Get All Budgets
- **URL:** `GET /api/budgets`
- **Headers:** `X-User-Id: 1`
- **Description:** Get all budgets for the user
- **Response:** Array of budget objects

#### Get Budgets by Month
- **URL:** `GET /api/budgets/month/{month}`
- **Headers:** `X-User-Id: 1`
- **Description:** Get budgets for a specific month (format: YYYY-MM)
- **Response:** Array of budget objects for the month

#### Get Budget by ID
- **URL:** `GET /api/budgets/{id}`
- **Headers:** `X-User-Id: 1`
- **Response:** Budget object

#### Update Budget
- **URL:** `PUT /api/budgets/{id}`
- **Headers:** `X-User-Id: 1`
- **Request Body:**
```json
{
  "monthlyLimit": 600.00,
  "month": "2026-04",
  "categoryId": 1
}
```
- **Response:** Updated budget object

#### Delete Budget
- **URL:** `DELETE /api/budgets/{id}`
- **Headers:** `X-User-Id: 1`
- **Response:** `204 No Content`

### Health Check

#### Health Status
- **URL:** `GET /api/health`
- **Description:** Check application status
- **Response:**
```json
{
  "status": "UP",
  "service": "Expense Tracker API",
  "version": "1.0.0"
}
```

## Entity Relationships

### User
- **Fields:** id, name, email, password, createdAt
- **Relationships:** One user has many expenses, categories, and budgets

### Category
- **Fields:** id, name, user (ManyToOne), createdAt
- **Relationships:** One category has many expenses and budgets

### Expense
- **Fields:** id, amount, description, expenseDate, user (ManyToOne), category (ManyToOne), createdAt, updatedAt
- **Relationships:** Many expenses belong to one user and one category

### Budget
- **Fields:** id, monthlyLimit, month, user (ManyToOne), category (ManyToOne), createdAt, updatedAt
- **Relationships:** Many budgets belong to one user and one category

## Validation Rules

### User Registration
- Name: Required, 1-100 characters
- Email: Required, valid email format, unique
- Password: Required, minimum 6 characters

### Category
- Name: Required, 1-100 characters, unique per user

### Expense
- Amount: Required, must be > 0, BigDecimal
- Description: Required, 1-255 characters
- Expense Date: Required, cannot be in future
- Category ID: Required, must exist

### Budget
- Monthly Limit: Required, must be > 0, BigDecimal
- Month: Required, format YYYY-MM
- Category ID: Required, must exist

## Error Handling

All errors are returned in the following format:
```json
{
  "status": 400,
  "message": "Error message",
  "error": "Error Type",
  "timestamp": "2026-04-04T10:30:00",
  "path": "/api/endpoint"
}
```

## Logging

Logging is configured in `application.properties`:
- Root level: INFO
- Application level: DEBUG
- Pattern includes timestamp, logger name, and message

## Authentication Note

This application uses header-based user identification for demonstration purposes. In production, implement:
- JWT (JSON Web Tokens)
- OAuth 2.0
- Spring Security authentication

Example header: `X-User-Id: 1`

## Database Schema

The application uses Hibernate JPA with the following main tables:
- `users` - User accounts
- `categories` - Expense categories
- `expenses` - Expense records
- `budgets` - Budget limits

Database initialization is automatic via Hibernate (ddl-auto=update).

## Future Enhancements

- JWT authentication implementation
- Budget alert notifications
- Expense recurring options
- Multi-currency support
- Data export (CSV, PDF)
- Charts and analytics dashboard
- User roles and permissions
- Integration with payment gateways
- Mobile application

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the project repository.

