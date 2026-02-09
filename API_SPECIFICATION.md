# API Specification - Shoe Store Backend

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### 1. Register User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "123-456-7890"  // optional
}

Response (201 Created):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

Status Codes:
- 201: Success
- 400: Invalid input or email already registered
- 500: Server error
```

### 2. Login User
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

Status Codes:
- 200: Success
- 400: Missing credentials
- 401: Invalid credentials
- 500: Server error
```

### 3. Get Current User Profile
```
GET /auth/profile
Authorization: Bearer <TOKEN>

Response (200 OK):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "role": "user",
  "createdAt": "2026-02-09T10:00:00Z"
}

Status Codes:
- 200: Success
- 401: Invalid token
- 500: Server error
```

---

## Shoe Endpoints

### 4. Get All Shoes
```
GET /shoes
Content-Type: application/json

Query Parameters (optional):
- category_id: ObjectId          // Filter by category
- min_price: number              // Minimum price filter
- max_price: number              // Maximum price filter

Examples:
/shoes
/shoes?category_id=507f1f77bcf86cd799439011
/shoes?min_price=100&max_price=150

Response (200 OK):
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Nike Boost",
    "description": "Premium running shoe",
    "price": 120,
    "size": "42",
    "color": "Black",
    "stock": 10,
    "category_id": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Sneakers"
    },
    "createdAt": "2026-02-09T10:00:00Z"
  }
]

Status Codes:
- 200: Success
- 500: Server error
```

### 5. Get Shoe by ID
```
GET /shoes/:id

Response (200 OK):
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Nike Boost",
  "description": "Premium running shoe",
  "price": 120,
  "size": "42",
  "color": "Black",
  "stock": 10,
  "category_id": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sneakers"
  },
  "createdAt": "2026-02-09T10:00:00Z"
}

Status Codes:
- 200: Success
- 404: Shoe not found
- 500: Server error
```

### 6. Create Shoe (Admin Only)
```
POST /shoes
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Request Body:
{
  "name": "Nike Boost",
  "description": "Premium running shoe",
  "price": 120,
  "size": "42",
  "color": "Black",
  "stock": 10,
  "category_id": "507f1f77bcf86cd799439011"
}

Response (201 Created):
{
  "message": "Shoe created",
  "shoe": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Nike Boost",
    ...
  }
}

Status Codes:
- 201: Created
- 400: Invalid input or missing required fields
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 7. Update Shoe (Admin Only)
```
PUT /shoes/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Request Body (all fields optional):
{
  "name": "Nike Boost Pro",
  "price": 130,
  "color": "White"
}

Response (200 OK):
{
  "message": "Shoe updated",
  "shoe": {
    ...updated shoe object...
  }
}

Status Codes:
- 200: Success
- 404: Shoe not found
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 8. Delete Shoe (Admin Only)
```
DELETE /shoes/:id
Authorization: Bearer <ADMIN_TOKEN>

Response (200 OK):
{
  "message": "Shoe deleted",
  "shoe": {
    ...deleted shoe object...
  }
}

Status Codes:
- 200: Success
- 404: Shoe not found
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 9. Update Shoe Stock (Admin Only)
```
PATCH /shoes/:id/stock
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Request Body:
{
  "quantity": 5    // Positive to add, negative to remove
}

Response (200 OK):
{
  "message": "Stock updated",
  "shoe": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Nike Boost",
    "stock": 15,  // Updated value
    ...
  }
}

Status Codes:
- 200: Success
- 404: Shoe not found
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

---

## Order Endpoints

### 10. Create Order
```
POST /orders
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

Request Body:
{
  "items": [
    {
      "shoe_id": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "shipping_address": "123 Main St, City, Country"
}

Response (201 Created):
{
  "message": "Order created",
  "order": {
    "_id": "507f1f77bcf86cd799439020",
    "customer_id": "507f1f77bcf86cd799439011",
    "items": [
      {
        "shoe_id": "507f1f77bcf86cd799439012",
        "shoe_name": "Nike Boost",
        "price": 120,
        "quantity": 2,
        "size": "42",
        "color": "Black"
      }
    ],
    "total_amount": 240,
    "status": "pending",
    "shipping_address": "123 Main St, City, Country",
    "createdAt": "2026-02-09T10:30:00Z"
  }
}

Status Codes:
- 201: Created
- 400: Invalid input, empty cart, or insufficient stock
- 401: Unauthorized
- 404: Shoe not found
- 500: Server error
```

### 11. Get User Orders
```
GET /orders
Authorization: Bearer <USER_TOKEN>

Response (200 OK):
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "customer_id": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [...],
    "total_amount": 240,
    "status": "pending",
    "createdAt": "2026-02-09T10:30:00Z"
  }
]

Status Codes:
- 200: Success
- 401: Unauthorized
- 500: Server error
```

### 12. Get Order by ID
```
GET /orders/user/:id
Authorization: Bearer <TOKEN>

Response (200 OK):
{
  "_id": "507f1f77bcf86cd799439020",
  "customer_id": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "address": "123 Main St"
  },
  "items": [...],
  "total_amount": 240,
  "status": "pending",
  "shipping_address": "123 Main St, City, Country",
  "createdAt": "2026-02-09T10:30:00Z"
}

Status Codes:
- 200: Success
- 401: Unauthorized
- 403: Access denied (user can only see own orders)
- 404: Order not found
- 500: Server error
```

### 13. Get All Orders (Admin Only)
```
GET /orders/admin/all
Authorization: Bearer <ADMIN_TOKEN>

Response (200 OK):
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "customer_id": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [...],
    "total_amount": 240,
    "status": "pending",
    "createdAt": "2026-02-09T10:30:00Z"
  }
]

Status Codes:
- 200: Success
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 14. Update Order Status (Admin Only)
```
PUT /orders/:id/status
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Request Body:
{
  "status": "shipped"  // Options: pending, confirmed, shipped, delivered, cancelled
}

Response (200 OK):
{
  "message": "Order status updated",
  "order": {
    "_id": "507f1f77bcf86cd799439020",
    "status": "shipped",
    ...
  }
}

Status Codes:
- 200: Success
- 404: Order not found
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 15. Get Sales Statistics (Admin Only)
```
GET /orders/admin/stats
Authorization: Bearer <ADMIN_TOKEN>

Response (200 OK):
{
  "orders_by_status": [
    {
      "_id": "confirmed",
      "count": 5,
      "total_revenue": 500
    },
    {
      "_id": "delivered",
      "count": 8,
      "total_revenue": 1200
    },
    {
      "_id": "pending",
      "count": 3,
      "total_revenue": 300
    }
  ],
  "total_stats": {
    "count": 16,
    "total_amount": 2000
  }
}

Notes: Uses aggregation pipeline with $match, $group, $sum

Status Codes:
- 200: Success
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 16. Get Top Selling Shoes (Admin Only)
```
GET /orders/admin/top-shoes
Authorization: Bearer <ADMIN_TOKEN>

Response (200 OK):
[
  {
    "_id": "Nike Boost",
    "quantity_sold": 25,
    "revenue": 3000
  },
  {
    "_id": "Adidas Ultraboost",
    "quantity_sold": 18,
    "revenue": 2700
  }
]

Notes: Uses aggregation with $unwind, $group, $multiply

Status Codes:
- 200: Success
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

---

## Category Endpoints

### 17. Get All Categories
```
GET /categories

Response (200 OK):
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sneakers",
    "description": "Casual sports shoes",
    "createdAt": "2026-02-09T10:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Boots",
    "description": "Professional boots",
    "createdAt": "2026-02-09T10:05:00Z"
  }
]

Status Codes:
- 200: Success
- 500: Server error
```

### 18. Create Category (Admin Only)
```
POST /categories
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Request Body:
{
  "name": "Formal",
  "description": "Formal wear shoes"
}

Response (201 Created):
{
  "message": "Category created",
  "category": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Formal",
    "description": "Formal wear shoes",
    "createdAt": "2026-02-09T10:10:00Z"
  }
}

Status Codes:
- 201: Created
- 400: Missing category name
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 19. Update Category (Admin Only)
```
PUT /categories/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Request Body (all optional):
{
  "name": "Formal Shoes",
  "description": "Updated description"
}

Response (200 OK):
{
  "message": "Category updated",
  "category": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Formal Shoes",
    ...
  }
}

Status Codes:
- 200: Success
- 404: Category not found
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

### 20. Delete Category (Admin Only)
```
DELETE /categories/:id
Authorization: Bearer <ADMIN_TOKEN>

Response (200 OK):
{
  "message": "Category deleted",
  "category": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Formal",
    ...
  }
}

Status Codes:
- 200: Success
- 404: Category not found
- 401: Unauthorized
- 403: Not admin
- 500: Server error
```

---

## Health Check

### Health Endpoint
```
GET /health

Response (200 OK):
{
  "status": "Server is running"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common Error Messages:
- "No token provided" - Missing Authorization header
- "Invalid token" - JWT token is invalid or expired
- "Admin access required" - User is not admin
- "Email already registered" - Email exists
- "Invalid credentials" - Wrong email or password
- "Shoe not found" - Shoe ID doesn't exist
- "Insufficient stock" - Not enough stock for order

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

---

## CORS Configuration

Frontend can be on different origin. CORS is enabled for all origins.

## Rate Limiting

Currently no rate limiting implemented. Recommended to add in production.

## Pagination

Not implemented. Recommended to add for large datasets:
- Add `limit` and `skip` query parameters
- Return pagination metadata

---

## Total Endpoints: 20

- Authentication: 3
- Shoes: 6
- Orders: 6
- Categories: 4
- Health: 1

**Exceeds requirement for 1-student project (minimum 8 endpoints)**
