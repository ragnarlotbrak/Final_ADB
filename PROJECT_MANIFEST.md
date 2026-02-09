# Project Manifest - Shoe Store

**Student:** Kassenov Abdulkarim, Atalykov Sultan (SE-2423)  

---

## Project Summary

A full-stack e-commerce web application demonstrating advanced MongoDB NoSQL database design, REST API development, and modern web application architecture.

---

##  Project Structure

```
final_Kassenov_Abdulkarim_SE-2423/
│
├──  README.md                    # Complete project documentation
├──  PROJECT_REPORT.md            # Detailed technical report (20+ pages)
├──  API_SPECIFICATION.md         # Full API endpoint documentation
├──  QUICK_START.md               # Installation and setup guide
├──  .gitignore                   # Git ignore configuration
│
├──  backend/                     # Node.js/Express Backend
│   ├──  server.js                # Express app entry point
│   ├──  package.json             # Dependencies
│   ├──  .env                     # Environment variables (MongoDB URI)
│   │
│   ├──  models/                  # MongoDB Schemas (Mongoose)
│   │   ├── Customer.js             # User collection schema
│   │   ├── Category.js             # Product category schema
│   │   ├── Shoe.js                 # Product schema
│   │   ├── Order.js                # Order schema (embedded items)
│   │   └── Payment.js              # Payment schema
│   │
│   ├──  controllers/             # Business Logic
│   │   ├── authController.js       # Authentication (register, login, profile)
│   │   ├── shoeController.js       # Shoe CRUD operations
│   │   ├── orderController.js      # Order management & aggregation
│   │   └── categoryController.js   # Category management
│   │
│   ├──  routes/                  # API Endpoints
│   │   ├── auth.js                 # /api/auth routes
│   │   ├── shoes.js                # /api/shoes routes
│   │   ├── orders.js               # /api/orders routes
│   │   └── categories.js           # /api/categories routes
│   │
│   └──  middleware/              # Express Middleware
│       └── auth.js                 # JWT authentication & authorization
│
└──  frontend/                    # HTML/CSS/JavaScript Frontend
    ├──  index.html               # Shop catalog page
    ├──  login.html               # Login page
    ├──  register.html            # Registration page
    ├──  orders.html              # Order history page
    ├──  admin.html               # Admin dashboard
    ├──  style.css                # Styling (responsive CSS Grid)
    └──  utils.js                 # JavaScript utilities & API calls
```

---

##  Key Features Implemented

### Backend (Node.js + Express)

**12+ API Endpoints** (Exceeds 8-endpoint requirement)

#### Authentication (3 endpoints)
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login with JWT
- GET `/api/auth/profile` - Return user profile

#### Shoes Management (6 endpoints)
- GET `/api/shoes` - List all shoes with filters
- GET `/api/shoes/:id` - Get shoe details
- POST `/api/shoes` - Create shoe (admin)
- PUT `/api/shoes/:id` - Update shoe (admin)
- DELETE `/api/shoes/:id` - Delete shoe (admin)
- PATCH `/api/shoes/:id/stock` - Update stock using $inc (admin)

#### Orders Management (6 endpoints)
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- GET `/api/orders/user/:id` - Get order details
- GET `/api/orders/admin/all` - Get all orders (admin)
- PUT `/api/orders/:id/status` - Update status (admin)
- GET `/api/orders/admin/stats` - Sales statistics aggregation (admin)
- GET `/api/orders/admin/top-shoes` - Top products aggregation (admin)

#### Categories Management (4 endpoints)
- GET `/api/categories` - List categories
- POST `/api/categories` - Create category (admin)
- PUT `/api/categories/:id` - Update category (admin)
- DELETE `/api/categories/:id` - Delete category (admin)

### Database (MongoDB)

**5 Collections with Advanced Features:**

1. **customers** - User accounts with role-based access
2. **categories** - Product organization
3. **shoes** - Product catalog with inventory
4. **orders** - Customer orders with embedded shoe data
5. **payments** - Payment tracking

**Advanced MongoDB Features:**
-  Embedded documents (shoe items in orders)
-  Referenced documents (customer, category, payment)
-  Compound indexes (category_id + stock)
-  Single indexes (price, email, createdAt)
-  Atomic operations ($inc for stock)
-  Multi-stage aggregation pipelines
-  JWT authentication & role-based authorization

### Frontend (HTML/CSS/JavaScript)

**4 Pages** (Exceeds 4-page requirement)

1. **index.html** - Shop Catalog
   - Browse shoes
   - Filter by category & price
   - Search functionality
   - Shopping cart
   - Responsive grid layout

2. **login.html** - User Authentication
   - Email/password login
   - JWT token management

3. **register.html** - User Registration
   - Create new account
   - Auto-login after registration

4. **orders.html** - Order History
   - View user orders
   - Order status tracking
   - Embedded item details

5. **admin.html** - Admin Dashboard (Bonus)
   - Sales statistics (aggregation data)
   - Top selling shoes
   - Product management
   - Category management
   - Order management

---

## Database Schema Details

### Collections & Relationships

```
customers (1) ──┬─→ (Many) orders
                └─→ (Many) payments

categories (1) ──→ (Many) shoes

shoes (embedded in) orders.items

orders (1) ──→ (One) payments
```

### Indexes Created

| Collection | Field(s) | Type |
|-----------|----------|------|
| customers | email | Unique |
| categories | name | Single |
| shoes | category_id, stock | Compound |
| shoes | price | Single |
| orders | customer_id, status | Compound |
| orders | createdAt | Single |
| payments | order_id | Unique |
| payments | customer_id | Single |

### Aggregation Pipelines

**Pipeline 1: Sales Statistics by Status**
```javascript
$match → $group (sum revenue) → $sort
```

**Pipeline 2: Top Selling Shoes**
```javascript
$unwind → $group → $multiply → $sort → $limit
```

---

##  Security Features

-  JWT Authentication (7-day expiration)
-  Role-based Authorization (admin/user)
-  Password Hashing (bcryptjs)
-  Protected Admin Endpoints
-  CORS Configuration
-  Input Validation

---

##  Technology Stack

### Backend
- **Runtime:** Node.js v14+
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs
- **Middleware:** CORS

### Frontend
- **Markup:** HTML5
- **Styling:** CSS3 (Grid, Flexbox, Responsive)
- **Scripting:** Vanilla JavaScript (ES6+)
- **API:** Fetch API
- **Storage:** localStorage

### Development
- **Package Manager:** npm
- **Environment:** .env configuration
- **Version Control:** Git

---

## Documentation Files

1. **README.md** (10 pages)
   - Project overview
   - System architecture diagram
   - Complete database schema explanation
   - All API endpoints with examples
   - Setup instructions
   - Testing guidelines

2. **PROJECT_REPORT.md** (20+ pages)
   - Executive summary
   - Detailed system architecture
   - Database design decisions
   - MongoDB features implementation
   - Security analysis
   - Performance analysis
   - Code quality assessment
   - Testing results

3. **API_SPECIFICATION.md** (15 pages)
   - All 20 endpoints documented
   - Request/response examples
   - Parameter descriptions
   - Status codes
   - Error formats
   - Format suitable for Swagger/OpenAPI

4. **QUICK_START.md** (5 pages)
   - Installation steps
   - Terminal commands
   - Sample data creation
   - API testing examples
   - Troubleshooting guide
   - Testing checklist

---

## Requirements Met

### Functional Requirements
-  Web application (not bot, game, or backend-only)
-  Backend + Frontend both implemented
-  MongoDB as primary database
-  RESTful API exposed
-  Meaningful business logic
-  Multiple collections with relationships
-  Authentication & Authorization

### Technical Requirements
-  12+ endpoints (exceeds 8 minimum)
-  Full CRUD functionality
-  Aggregation-based endpoints (2 pipelines)
-  Advanced update/delete operators ($inc, $set)
-  Embedded documents (order items)
-  Referenced documents (customer, category, payment)
-  Compound indexes
-  5 pages (exceeds 4 minimum)
-  Real HTTP requests to backend
-  Functional, non-broken UI

### Documentation Requirements
-  Project overview
-  System architecture
-  Database schema
-  MongoDB queries
-  API documentation
-  Indexing strategy
-  README + Report

---

##  Setup Instructions

### Quick Setup
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
python -m http.server 8000
```

Access: `http://localhost:8000`

**For detailed setup, see QUICK_START.md**

---

## ✅ Quality Assurance

### Code Quality
- Modular architecture (Models, Controllers, Routes)
- Proper error handling
- Input validation
- Security best practices
- Clean, readable code

### Testing
- User registration/login
- Shoe catalog browsing
- Shopping cart functionality
- Order placement
- Order history viewing
- Admin dashboard features
- API endpoint testing

### Performance
- Indexed queries for fast lookups
- Embedded documents to reduce query count
- Atomic operations for data integrity
- Proper database connection pooling

---

##  Files Summary

### Backend
- 1 main server file
- 5 database models
- 4 controllers
- 4 route files
- 1 middleware file
- 1 package.json
- 1 .env file
**Total: 17 files**

### Frontend
- 5 HTML pages
- 1 CSS stylesheet
- 1 JavaScript utility file
**Total: 7 files**

### Documentation
- README.md
- PROJECT_REPORT.md
- API_SPECIFICATION.md
- QUICK_START.md
- .gitignore
**Total: 5 files**

**Grand Total: 29 files**

---

### Quick Troubleshooting
- See QUICK_START.md for common issues
- Check MongoDB connection in .env
- Verify Node.js version compatibility
- Clear browser cache for frontend issues

### Resources
- MongoDB Docs: https://docs.mongodb.com
- Express.js Guide: https://expressjs.com
- Mongoose ODM: https://mongoosejs.com
