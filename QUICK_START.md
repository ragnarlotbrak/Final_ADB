# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- npm
- Internet connection

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Start MongoDB Connection
The MongoDB URI is already configured in `.env`:
```
MONGO_URI=mongodb+srv://Kassenov_Abdulkarim_SE2423:qazsat12@m0.5ndzsan.mongodb.net/shop?retryWrites=true&w=majority&appName=M0
```

## Step 3: Start Backend Server

```bash
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

## Step 4: Start Frontend Server (New Terminal)

Option A - Using Python:
```bash
cd frontend
python -m http.server 8000
```

Option B - Using Node.js (npx):
```bash
cd frontend
npx http-server
```

## Step 5: Access Application

Open browser and navigate to:
```
http://localhost:8000
```

## First Use

### Create Admin Account
1. Register a new account at http://localhost:8000/register.html
2. Use MongoDB Compass or command line to update role:
```javascript
db.customers.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Create Sample Data

**From Admin Dashboard:**
1. Login with admin account
2. Go to Categories tab → Add "Sneakers", "Boots", "Formal"
3. Go to Shoes tab → Add sample shoes with different categories

OR

**Using MongoDB Commands:**
```javascript
// Add categories
db.categories.insertMany([
  { name: "Sneakers", description: "Casual sports shoes" },
  { name: "Boots", description: "Professional boots" },
  { name: "Formal", description: "Formal wear shoes" }
])

// Add shoes (replace category IDs)
db.shoes.insertMany([
  {
    name: "Nike Air Max",
    description: "Classic running shoe",
    price: 120,
    size: "42",
    color: "Black",
    stock: 10,
    category_id: ObjectId("...") // Replace with actual category ID
  }
])
```

## API Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Shoes:**
```bash
curl http://localhost:5000/api/shoes
```

## Troubleshooting

### MongoDB Connection Error
- Check internet connection
- Verify MongoDB URI in .env
- Check MongoDB Atlas whitelist IP

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### CORS Errors
- Backend CORS is configured for all origins
- Clear browser cache and reload
- Check browser developer console for details

### JWT Token Expiration
- Tokens expire in 7 days
- Login again to get new token
- Check browser localStorage

## Project Structure

```
final_Kassenov_Abdulkarim_SE-2423/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── server.js        # Express app
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html       # Shop page
│   ├── login.html       # Login page
│   ├── register.html    # Registration
│   ├── orders.html      # Order history
│   ├── admin.html       # Admin panel
│   ├── style.css        # Styling
│   └── utils.js         # Helper functions
├── README.md            # Full documentation
├── PROJECT_REPORT.md    # Detailed report
└── QUICK_START.md       # This file
```

## Key Features by Role

### User Features
- Browse shoe catalog
- Filter by category and price
- Add items to shopping cart
- Place orders
- View order history
- Track order status

### Admin Features
- Create and manage shoe products
- Update stock levels
- Create and manage categories
- View all customer orders
- Update order status
- View sales statistics
- See top selling products

## Testing Checklist

- [ ] Register new user
- [ ] Login successfully
- [ ] View shoes catalog
- [ ] Filter shoes by category
- [ ] Search for shoes
- [ ] Add shoes to cart
- [ ] Modify cart quantities
- [ ] Remove items from cart
- [ ] Create order
- [ ] View order history
- [ ] Admin: Create category
- [ ] Admin: Create shoe
- [ ] Admin: Update shoe
- [ ] Admin: View all orders
- [ ] Admin: Update order status
- [ ] Admin: View sales statistics

## Questions?

Refer to:
- README.md - Complete project documentation
- PROJECT_REPORT.md - Detailed technical report
- Backend API responses for error messages
- Browser console for CORS/JavaScript errors

---

Happy Testing! 🎉
