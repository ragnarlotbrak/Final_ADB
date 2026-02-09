# Shoe Store - Advanced NoSQL Database Project

## Project Overview

Shoe Store is a complete web application demonstrating advanced MongoDB concepts and best practices for NoSQL database design. The system implements a real-world e-commerce scenario with role-based access (admin and user), featuring inventory management, order processing, and sales analytics.

**Team Member:** Kassenov Abdulkarim (SE-2423)

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)               │
│  - Shop Catalog Page                                    │
│  - Login/Register Pages                                 │
│  - Order Management Page                                │
│  - Admin Dashboard                                      │
└──────────────────┬──────────────────────────────────────┘
                   │ (HTTP REST API)
┌──────────────────▼──────────────────────────────────────┐
│              Backend (Node.js + Express)                │
│  - Authentication (JWT)                                 │
│  - RESTful API Endpoints                                │
│  - Business Logic                                       │
│  - Authorization (Role-based)                           │
└──────────────────┬──────────────────────────────────────┘
                   │ (Mongoose ODM)
┌──────────────────▼──────────────────────────────────────┐
│         MongoDB Database (NoSQL)                        │
│  - Embedded Documents (Order Items)                     │
│  - Referenced Documents (Foreign Keys)                  │
│  - Indexes for Optimization                            │
│  - Aggregation Pipelines                               │
└──────────────────────────────────────────────────────────┘
```

## Database Schema Description

### Collections Overview

#### 1. **customers** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (enum: ['user', 'admin']),
  createdAt: Date
}
```
- **Indexes:** `email` for unique constraint and login
- **Purpose:** User authentication and profile management

#### 2. **categories** Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  createdAt: Date
}
```
- **Indexes:** `name` for fast category lookups
- **Relationship:** Referenced in shoes collection
- **Purpose:** Organize shoes by type (Sneakers, Boots, etc.)

#### 3. **shoes** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  size: String,
  color: String,
  stock: Number,
  image_url: String,
  category_id: ObjectId (Reference to Category),
  createdAt: Date
}
```
- **Indexes:** 
  - Compound index: `category_id + stock` (for filtering by category and availability)
  - Single index: `price` (for price range queries)
- **Relationship:** References `categories` collection (Many-to-One)
- **Purpose:** Product catalog with inventory tracking

#### 4. **orders** Collection
```javascript
{
  _id: ObjectId,
  customer_id: ObjectId (Reference to Customer),
  items: [
    {
      shoe_id: ObjectId,
      shoe_name: String,          // EMBEDDED
      price: Number,              // EMBEDDED
      quantity: Number,
      size: String,               // EMBEDDED
      color: String               // EMBEDDED
    }
  ],
  total_amount: Number,
  status: String (enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  shipping_address: String,
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes:**
  - Compound index: `customer_id + status` (for user order queries)
  - Single index: `createdAt` (for sorting by date)
- **Relationships:**
  - References `customers` collection (Many-to-One)
  - **Embedded documents** for shoe data (Denormalization for performance)
- **Purpose:** Customer order records with order items

#### 5. **payments** Collection
```javascript
{
  _id: ObjectId,
  order_id: ObjectId (Reference to Order, unique),
  customer_id: ObjectId (Reference to Customer),
  amount: Number,
  payment_method: String (enum: ['credit_card', 'debit_card', 'cash']),
  status: String (enum: ['pending', 'completed', 'failed', 'refunded']),
  transaction_id: String,
  createdAt: Date
}
```
- **Indexes:**
  - `order_id` (unique, for one-to-one relationship)
  - `customer_id` (for payment history)
- **Relationships:**
  - References `orders` and `customers` collections
- **Purpose:** Payment tracking

## Data Modeling Strategy

### Embedded vs Referenced Documents

**Embedded Documents (orders.items):**
- Shoe data is embedded in order items for performance
- Reasons:
  - Order items rarely change after creation
  - Improved read performance (no additional lookup)
  - Atomic operations for order placement
  - Snapshot of shoe data at time of order

**Referenced Documents:**
- `customer_id` in orders (not embedding customer)
  - Reasons: Customer data changes frequently, reduce duplication
  - Customer may have many orders (space efficiency)
  
- `category_id` in shoes
  - Reasons: Category may have many shoes, category data stability
  
- `order_id` in payments
  - Reasons: One-to-one relationship, access pattern separate

## API Endpoints

### Authentication Endpoints

#### 1. POST `/api/auth/register`
Register a new user
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "123-456-7890"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. POST `/api/auth/login`
Login user
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### 3. GET `/api/auth/profile`
Get current user profile (requires authentication)
```
Headers: Authorization: Bearer <token>

Response: { user object }
```

### Shoe Endpoints

#### 4. GET `/api/shoes`
Get all shoes with optional filters
```
Query Parameters:
- category_id: Filter by category
- min_price: Minimum price
- max_price: Maximum price

Response: [{ shoe object 1 }, { shoe object 2 }, ...]
```

#### 5. GET `/api/shoes/:id`
Get specific shoe details

#### 6. POST `/api/shoes` (Admin Only)
Create new shoe
```json
Request:
{
  "name": "Nike Boost",
  "price": 120,
  "size": "42",
  "color": "Black",
  "stock": 50,
  "category_id": "category_id",
  "description": "Premium running shoe"
}

Response: { message, shoe object }
```

#### 7. PUT `/api/shoes/:id` (Admin Only)
Update shoe details

#### 8. DELETE `/api/shoes/:id` (Admin Only)
Delete shoe

#### 9. PATCH `/api/shoes/:id/stock` (Admin Only)
Update shoe stock using $inc operator
```json
Request:
{
  "quantity": 10  // Can be negative to decrease
}
```

### Order Endpoints

#### 10. POST `/api/orders` (Authenticated)
Create new order
```json
Request:
{
  "items": [
    {
      "shoe_id": "shoe_id",
      "quantity": 2
    }
  ],
  "shipping_address": "123 Main St"
}

Response: { message, order object with embedded shoe data }
```

#### 11. GET `/api/orders` (Authenticated)
Get user's orders

#### 12. GET `/api/orders/user/:id` (Authenticated)
Get specific order details

#### 13. GET `/api/orders/admin/all` (Admin Only)
Get all orders

#### 14. PUT `/api/orders/:id/status` (Admin Only)
Update order status
```json
Request:
{
  "status": "shipped"
}
```

#### 15. GET `/api/orders/admin/stats` (Admin Only)
Get sales statistics using aggregation pipeline
```
Returns:
{
  "orders_by_status": [
    {
      "_id": "delivered",
      "count": 5,
      "total_revenue": 500
    }
  ],
  "total_stats": {
    "count": 10,
    "total_amount": 1200
  }
}
```

#### 16. GET `/api/orders/admin/top-shoes` (Admin Only)
Get top selling shoes using aggregation pipeline
```
Returns:
[
  {
    "_id": "Nike Boost",
    "quantity_sold": 15,
    "revenue": 1800
  }
]
```

### Category Endpoints

#### 17. GET `/api/categories`
Get all categories

#### 18. POST `/api/categories` (Admin Only)
Create category

#### 19. PUT `/api/categories/:id` (Admin Only)
Update category

#### 20. DELETE `/api/categories/:id` (Admin Only)
Delete category

## Advanced MongoDB Operations

### 1. Embedded Documents with Item Snapshot
When creating an order, shoe data is embedded to capture state at purchase time:
```javascript
const processedItems = [];
for (const item of items) {
  const shoe = await Shoe.findById(item.shoe_id);
  processedItems.push({
    shoe_id: shoe._id,
    shoe_name: shoe.name,      // Embedded
    price: shoe.price,          // Embedded
    quantity: item.quantity,
    size: shoe.size,            // Embedded
    color: shoe.color           // Embedded
  });
}
```

### 2. Atomic Increment Operation ($inc)
Update stock with atomic increment/decrement:
```javascript
await Shoe.findByIdAndUpdate(
  shoe._id,
  { $inc: { stock: -quantity } }  // Atomic decrement
);
```

### 3. Multi-stage Aggregation Pipeline - Sales Statistics
```javascript
db.orders.aggregate([
  {
    $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } }
  },
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      total_revenue: { $sum: '$total_amount' }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

### 4. Aggregation with $unwind and $multiply
Get top selling shoes:
```javascript
db.orders.aggregate([
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.shoe_name',
      quantity_sold: { $sum: '$items.quantity' },
      revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
    }
  },
  { $sort: { quantity_sold: -1 } },
  { $limit: 10 }
])
```

## Indexing and Optimization Strategy

### Indexes Created

| Collection | Index Fields | Type | Purpose |
|-----------|--------------|------|---------|
| customers | email | Unique | Fast login lookups, email uniqueness |
| categories | name | Single | Fast category filtering |
| shoes | category_id, stock | Compound | Category-based product listing |
| shoes | price | Single | Price range queries |
| orders | customer_id, status | Compound | User's order history filtering |
| orders | createdAt | Single | Sorting orders by date |
| payments | order_id | Unique | One-to-one relationship enforcement |
| payments | customer_id | Single | Payment history lookups |

### Performance Optimizations

1. **Compound Indexes:** `category_id + stock` enables efficient product discovery
2. **Embedded Documents:** Reduces database queries for order item details
3. **Atomic Operations:** Stock updates use `$inc` for atomicity
4. **Query Projection:** Only select needed fields in responses
5. **Proper Relationships:** Referenced documents prevent data duplication

## Authentication and Authorization

### JWT Implementation
- Tokens issued upon successful login/registration
- Token expires in 7 days
- Stored in localStorage on client

### Role-based Access Control
```javascript
// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

Admin-only endpoints:
- All shoe management (create, update, delete, stock)
- All category management
- View all orders
- Update order status
- View sales statistics

## Frontend Structure

### Pages

1. **index.html** - Shop Catalog
   - Browse shoes
   - Filter by category and price
   - Shopping cart

2. **login.html** - User Login
   - Email and password authentication
   - JWT token management

3. **register.html** - User Registration
   - New account creation
   - Auto-login after registration

4. **orders.html** - Order History
   - View all user orders
   - Order details with embedded items

5. **admin.html** - Admin Dashboard
   - Sales statistics with aggregation
   - Top selling shoes
   - Manage shoes and categories
   - Manage all orders

### Features
- Real-time API integration using `fetch()`
- Client-side cart management
- Role-based UI (admin panel hidden from users)
- Responsive design with CSS Grid
- Input validation
- Error handling and user feedback

## Setup Instructions

### Backend Setup

1. **Install Dependencies:**
```bash
cd backend
npm install
```

2. **Configure Environment:**
- `.env` file is already configured with MongoDB URI
- Set JWT_SECRET in .env

3. **Run Server:**
```bash
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. **Start Local Server:**
```bash
cd frontend
# Use any local server (Python, Node, etc.)
python -m http.server 8000
```

2. **Access Application:**
Open `http://localhost:8000` in browser

### Default Admin Account
Create an admin account during registration and manually update role in MongoDB:
```javascript
db.customers.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Testing the Application

### User Flow
1. Register new account at `/register.html`
2. Browse shoes on `/index.html`
3. Add items to cart
4. Checkout with shipping address
5. View orders at `/orders.html`

### Admin Flow
1. Login with admin account
2. Navigate to Admin Panel
3. **Dashboard:** View sales statistics and top products
4. **Manage Shoes:** Create, edit, update stock, delete
5. **Manage Categories:** Create and delete categories
6. **All Orders:** View and update order status

## Project Limitations & Assumptions

1. **No Payment Processing:** Payment collection exists but uses dummy data
2. **Single Admin Account:** Project assumes one main admin account
3. **Local Storage:** Frontend uses localStorage (not recommended for production)
4. **No Email Notifications:** Orders don't trigger actual emails
5. **File Uploads:** Shoe images uses emoji placeholder instead of real uploads

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (Grid, Flexbox)
- **Vanilla JavaScript** - No frameworks
- **Fetch API** - HTTP requests

## Conclusion

This project demonstrates:
 Advanced MongoDB data modeling (embedded & referenced)
 CRUD operations across multiple collections
 Multi-stage aggregation pipelines
 Compound indexes for optimization
 JWT authentication and role-based authorization
 RESTful API design principles
 Frontend and backend integration
 Database schema documentation
#   F i n a l _ A D B  
 