# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│              Next.js / React Frontend                    │
│              (Port 3000)                                 │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST API
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Express.js Backend API                      │
│              (Port 5000)                                 │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Routes  │ │Middleware│ │Controller│ │  Models  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Database                        │
│  Collections: users, products, orders, reviews          │
└─────────────────────────────────────────────────────────┘

External Services:
  ┌──────────────┐    ┌──────────────┐
  │    Stripe    │    │  Nodemailer  │
  │  (Payments)  │    │   (Emails)   │
  └──────────────┘    └──────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with file-based routing
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form validation
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Context API** - State management (Auth + Cart)

### Backend
- **Express.js** - Node.js web framework
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Joi** - Input validation
- **express-rate-limit** - Rate limiting
- **cors** - CORS protection

### Database
- **MongoDB** - NoSQL document database

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## Frontend Architecture

### Pages (Next.js Routes)
```
/                    → Home page
/products            → Product listing
/product/[id]        → Product detail
/cart                → Shopping cart
/checkout            → Checkout flow
/login               → User login
/register            → User registration
/profile             → User profile
/orders              → Order history
/orders/[id]         → Order detail
/wishlist            → Wishlist
/admin/dashboard     → Admin analytics
/admin/products      → Product management
/admin/orders        → Order management
```

### State Management
- **AuthContext** - User authentication state (token, user info)
- **CartContext** - Shopping cart state (items, totals)
- Both contexts use localStorage for persistence

### API Layer
- Centralized Axios instance in `lib/api.js`
- Automatic token injection via request interceptor
- Auto-logout on 401 responses via response interceptor

---

## Backend Architecture

### Request Flow
```
Request → Rate Limiter → CORS → Body Parser → Routes → Middleware → Controller → Model → DB
```

### Authentication Flow
1. User logs in → JWT token + refresh token issued
2. Frontend stores tokens in localStorage
3. Token sent as `Authorization: Bearer <token>` header
4. `protect` middleware validates token on protected routes
5. `adminOnly` middleware checks admin role

### Middleware Stack
- `protect` - JWT authentication
- `adminOnly` - Admin role check
- `errorHandler` - Centralized error handling
- `express-rate-limit` - Rate limiting (100 req/15min)

---

## Security Features

1. **Password Hashing** - bcrypt with salt rounds of 12
2. **JWT Tokens** - Short-lived access tokens (30d) + refresh tokens (7d)
3. **Input Validation** - Joi schema validation on all inputs
4. **CORS** - Restricted to frontend origin only
5. **Rate Limiting** - 100 requests per 15 minutes
6. **Error Handling** - No stack traces in production
7. **Mongoose Sanitization** - Query sanitization built-in

---

## Data Flow

### Add to Cart
1. User clicks "Add to Cart"
2. CartContext updates local state
3. Cart saved to localStorage
4. Cart count badge updates in Navbar

### Checkout Flow
1. User reviews cart → enters shipping address
2. Order created via POST /api/orders
3. Payment processed via Stripe
4. Order status updated to "processing"
5. Confirmation email sent
6. Cart cleared

### Admin Workflow
1. Admin logs in (role: "admin")
2. Access admin pages via /admin/*
3. API requests include admin token
4. Backend validates admin role via `adminOnly` middleware
