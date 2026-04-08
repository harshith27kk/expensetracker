# Implementation Details & Code Structure

## Complete Spring Boot Expense Tracker Application

This document provides comprehensive details about the implementation of the Expense Tracker application.

## File Structure

```
expensetracker/
├── src/main/java/com/expensetracker/
│   ├── config/
│   │   └── ApplicationConfiguration.java       # Spring configuration
│   │
│   ├── controller/
│   │   ├── AuthController.java                 # Auth endpoints
│   │   ├── ExpenseController.java              # Expense endpoints
│   │   ├── CategoryController.java             # Category endpoints
│   │   ├── BudgetController.java               # Budget endpoints
│   │   └── HealthCheckController.java          # Health monitoring
│   │
│   ├── service/
│   │   ├── UserService.java                    # User business logic
│   │   ├── ExpenseService.java                 # Expense operations
│   │   ├── CategoryService.java                # Category operations
│   │   └── BudgetService.java                  # Budget operations
│   │
│   ├── repository/
│   │   ├── UserRepository.java                 # User data access
│   │   ├── ExpenseRepository.java              # Expense queries
│   │   ├── CategoryRepository.java             # Category queries
│   │   └── BudgetRepository.java               # Budget queries
│   │
│   ├── entity/
│   │   ├── User.java                           # User entity
│   │   ├── Category.java                       # Category entity
│   │   ├── Expense.java                        # Expense entity
│   │   └── Budget.java                         # Budget entity
│   │
│   ├── dto/
│   │   ├── UserRegisterRequestDTO.java         # Register request
│   │   ├── UserLoginRequestDTO.java            # Login request
│   │   ├── UserResponseDTO.java                # User response
│   │   ├── ExpenseRequestDTO.java              # Expense request
│   │   ├── ExpenseResponseDTO.java             # Expense response
│   │   ├── CategoryRequestDTO.java             # Category request
│   │   ├── CategoryResponseDTO.java            # Category response
│   │   ├── BudgetRequestDTO.java               # Budget request
│   │   ├── BudgetResponseDTO.java              # Budget response
│   │   └── ErrorResponseDTO.java               # Error response
│   │
│   ├── exception/
│   │   ├── ResourceNotFoundException.java      # 404 exceptions
│   │   ├── InvalidInputException.java          # 400 exceptions
│   │   ├── DuplicateResourceException.java     # 409 exceptions
│   │   └── GlobalExceptionHandler.java         # Exception handler
│   │
│   ├── util/
│   │   ├── PasswordEncoderUtil.java            # Password operations
│   │   └── ExpenseMapper.java                  # Entity to DTO mapping
│   │
│   └── ExpensetrackerApplication.java          # Main entry point
│
├── src/main/resources/
│   └── application.properties                  # Application config
│
├── build.gradle                                # Gradle configuration
├── README.md                                   # Main documentation
├── API_TESTING.md                              # API testing guide
└── IMPLEMENTATION_DETAILS.md                   # This file
```

## Key Design Patterns Used

### 1. Layered Architecture
- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic and validation
- **Repository Layer**: Data access and database operations
- **Entity Layer**: JPA entities mapped to database tables

### 2. Data Transfer Objects (DTOs)
- Request DTOs validate incoming data
- Response DTOs prevent exposing sensitive entity details
- Mapper utilities convert between entities and DTOs

### 3. Exception Handling
- Custom exceptions for different error scenarios
- Global exception handler (@ControllerAdvice)
- Standardized error response format

### 4. Dependency Injection
- Constructor injection for all services
- Spring manages bean instantiation and lifecycle
- Loose coupling between components

## Entity Relationships

### User Entity
```
User (1) ──── (N) Expense
User (1) ──── (N) Category
User (1) ──── (N) Budget
```

### Category Entity
```
Category (1) ──── (N) Expense
Category (1) ──── (N) Budget
```

### JPA Annotations Used
- `@Entity`: Marks class as JPA entity
- `@Table`: Specifies table name
- `@Id`: Primary key field
- `@GeneratedValue`: Auto-increment ID
- `@Column`: Column constraints and metadata
- `@ManyToOne`: Many-to-one relationship
- `@OneToMany`: One-to-many relationship
- `@JoinColumn`: Foreign key mapping
- `@UniqueConstraint`: Unique constraints
- `@PrePersist`: Lifecycle callback before insert
- `@PreUpdate`: Lifecycle callback before update

## Service Layer Implementation

### UserService
**Responsibilities:**
- User registration with validation and password encryption
- User authentication (login)
- User retrieval by ID and email

**Key Methods:**
```java
public UserResponseDTO register(UserRegisterRequestDTO request)
public UserResponseDTO login(UserLoginRequestDTO request)
public UserResponseDTO getUserById(Long id)
public UserResponseDTO getUserByEmail(String email)
protected User getUserEntityById(Long id)
```

### ExpenseService
**Responsibilities:**
- Create, read, update, delete expenses
- Filter expenses by month and/or category
- Validate expense data (amount > 0, dates, required fields)

**Key Methods:**
```java
public ExpenseResponseDTO createExpense(Long userId, ExpenseRequestDTO request)
public List<ExpenseResponseDTO> getAllExpenses(Long userId, String month, Long categoryId)
public ExpenseResponseDTO getExpenseById(Long userId, Long expenseId)
public ExpenseResponseDTO updateExpense(Long userId, Long expenseId, ExpenseRequestDTO request)
public void deleteExpense(Long userId, Long expenseId)
```

**Validation:**
- Amount must be > 0 (BigDecimal)
- Description required (1-255 characters)
- Expense date must not be in future
- Category must exist

### CategoryService
**Responsibilities:**
- Create, read, update, delete categories
- Enforce unique category names per user
- Cascade operations (delete expenses/budgets when category deleted)

**Key Methods:**
```java
public CategoryResponseDTO createCategory(Long userId, CategoryRequestDTO request)
public List<CategoryResponseDTO> getAllCategories(Long userId)
public CategoryResponseDTO getCategoryById(Long userId, Long categoryId)
public CategoryResponseDTO updateCategory(Long userId, Long categoryId, CategoryRequestDTO request)
public void deleteCategory(Long userId, Long categoryId)
```

### BudgetService
**Responsibilities:**
- Create, read, update, delete budgets
- Manage monthly budget limits per category
- Prevent duplicate budgets for same month/category

**Key Methods:**
```java
public BudgetResponseDTO createBudget(Long userId, BudgetRequestDTO request)
public List<BudgetResponseDTO> getAllBudgets(Long userId)
public List<BudgetResponseDTO> getBudgetsByMonth(Long userId, String month)
public BudgetResponseDTO getBudgetById(Long userId, Long budgetId)
public BudgetResponseDTO updateBudget(Long userId, Long budgetId, BudgetRequestDTO request)
public void deleteBudget(Long userId, Long budgetId)
```

## Repository Layer

### Custom Query Methods
- `findByUser()`: Get all records for a user
- `findByIdAndUser()`: Verify ownership before returning
- `findByExpenseDateBetween()`: Date range filtering
- `findByUserAndCategory()`: Category-specific records
- `findByUserAndMonth()`: Month-specific budgets

## REST Controller Design

### URL Patterns
```
Authentication:
POST   /api/auth/register
POST   /api/auth/login

Categories:
POST   /api/categories
GET    /api/categories
GET    /api/categories/{id}
PUT    /api/categories/{id}
DELETE /api/categories/{id}

Expenses:
POST   /api/expenses
GET    /api/expenses (with optional filters)
GET    /api/expenses/{id}
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}

Budgets:
POST   /api/budgets
GET    /api/budgets
GET    /api/budgets/month/{month}
GET    /api/budgets/{id}
PUT    /api/budgets/{id}
DELETE /api/budgets/{id}

Health:
GET    /api/health
```

### Request/Response Flow
1. Client sends HTTP request to controller
2. Controller uses @Valid to validate DTOs
3. Service layer processes business logic
4. Repository layer interacts with database
5. Exceptions are caught by GlobalExceptionHandler
6. Standardized response returned to client

## Validation Framework

### Annotations Used
- `@NotNull`: Field cannot be null
- `@NotBlank`: String cannot be empty
- `@Email`: Valid email format
- `@Size`: String length validation
- `@DecimalMin`: Minimum decimal value
- `@Pattern`: Regex pattern matching
- `@PastOrPresent`: Date must not be in future

### Validation Flow
1. DTO annotations define constraints
2. Spring's @Valid trigger validation
3. MethodArgumentNotValidException caught
4. GlobalExceptionHandler formats error response

## Security Considerations

### Password Management
- Passwords hashed using BCrypt algorithm
- PasswordEncoderUtil provides encode/match operations
- Plain text passwords never stored in database

### User Authorization
- Header-based user identification (X-User-Id)
- **Production Note:** Replace with JWT or OAuth 2.0
- Service methods verify user ownership

### Data Protection
- @JsonIgnore could prevent password exposure in responses
- DTOs separate entity details from API contracts
- Lazy loading prevents N+1 query problems

## Database Schema

### users table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL
);
```

### categories table
```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### expenses table
```sql
CREATE TABLE expenses (
  id BIGSERIAL PRIMARY KEY,
  amount DECIMAL(19,2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  expense_date DATE NOT NULL,
  user_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### budgets table
```sql
CREATE TABLE budgets (
  id BIGSERIAL PRIMARY KEY,
  monthly_limit DECIMAL(19,2) NOT NULL,
  month VARCHAR(7) NOT NULL,
  user_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE (user_id, category_id, month),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## Error Handling Strategy

### Exception Types
1. **ResourceNotFoundException** (404)
   - Resource doesn't exist
   - User not found
   - Category not found
   - Expense not found
   - Budget not found

2. **InvalidInputException** (400)
   - Validation errors
   - Business rule violations
   - Invalid data format

3. **DuplicateResourceException** (409)
   - User already exists
   - Category name exists
   - Budget already exists

4. **Generic Exception** (500)
   - Unexpected errors
   - Database errors

## Logging Implementation

### Log Levels
- **INFO**: User actions, registration, login
- **DEBUG**: Service method invocations
- **WARN**: Business rule violations
- **ERROR**: Exceptions and errors

### Configuration
```properties
logging.level.root=INFO
logging.level.com.expensetracker=DEBUG
```

## Lombok Features Used

### Annotations
- `@Getter`: Generate getter methods
- `@Setter`: Generate setter methods
- `@NoArgsConstructor`: Default constructor
- `@AllArgsConstructor`: Constructor with all fields
- `@Builder`: Builder pattern support
- `@Builder.Default`: Default value in builder

### Benefits
- Reduces boilerplate code
- Cleaner entity and DTO classes
- Less code to maintain

## Spring Boot Configuration

### Dependencies
- **spring-boot-starter-web**: MVC and REST support
- **spring-boot-starter-data-jpa**: JPA and Hibernate
- **spring-boot-starter-validation**: Bean validation
- **spring-security-crypto**: Password encoding
- **postgresql**: Database driver
- **spring-boot-devtools**: Development tools
- **lombok**: Boilerplate reduction

### Properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expensetracker_db
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

## Transaction Management

### @Transactional Usage
- Service methods use @Transactional
- Default: readOnly=false
- Read-only methods: readOnly=true
- Automatic rollback on exceptions

## Performance Considerations

### Query Optimization
- Lazy loading on relationships
- JOIN queries for filtering
- Index on foreign keys (automatic)
- UNIQUE constraints on logical keys

### Batch Operations
```properties
spring.jpa.properties.hibernate.jdbc.batch_size=20
```

## Testing Strategy

### Unit Testing Areas
- Service layer validation
- Exception handling
- Data mapping
- Business logic

### Integration Testing
- Controller endpoints
- Repository queries
- Database operations
- End-to-end flows

## Future Improvements

1. **Authentication**
   - Implement JWT tokens
   - OAuth 2.0 integration
   - Role-based access control

2. **Features**
   - Budget alerts/notifications
   - Recurring expenses
   - Reports and analytics
   - Data export (CSV, PDF)

3. **Performance**
   - Caching implementation
   - Query optimization
   - Pagination for list endpoints

4. **Monitoring**
   - Application metrics
   - Health check endpoints
   - Error tracking

## Code Quality Standards

### Best Practices Implemented
- ✅ Constructor injection (no field injection)
- ✅ Proper exception handling
- ✅ Input validation
- ✅ Logging at appropriate levels
- ✅ Clean separation of concerns
- ✅ RESTful API design
- ✅ Consistent naming conventions
- ✅ Comprehensive documentation

### Coding Guidelines
- Single Responsibility Principle
- Dependency Injection
- DRY (Don't Repeat Yourself)
- SOLID principles
- Clean Code practices

## Deployment Considerations

### Build Artifact
- `build/libs/expensetracker-0.0.1-SNAPSHOT.jar`
- Executable JAR file
- Includes all dependencies

### System Requirements
- Java 25 runtime
- PostgreSQL 12+ database
- Minimum 512MB memory
- Network access to database

### Environment Configuration
Use environment variables or external properties file:
```properties
spring.datasource.url=jdbc:postgresql://DB_HOST:5432/DB_NAME
spring.datasource.username=DB_USER
spring.datasource.password=DB_PASSWORD
```

## API Response Standards

### Success Response (200, 201)
```json
{
  "id": 1,
  "name": "Example",
  ...
}
```

### Error Response (4xx, 5xx)
```json
{
  "status": 400,
  "message": "Error message",
  "error": "Error Type",
  "timestamp": "ISO8601",
  "path": "/api/endpoint"
}
```

## Documentation Files

- **README.md**: Project overview and API documentation
- **API_TESTING.md**: Curl commands and testing guide
- **IMPLEMENTATION_DETAILS.md**: This file - detailed architecture

---

This implementation provides a production-ready, scalable, and maintainable expense tracking application with comprehensive error handling, validation, and clean code architecture.

