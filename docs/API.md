# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" }
}
```

### POST /auth/login
Login with email and password.

**Body:**
```json
{ "email": "john@example.com", "password": "password123" }
```

### POST /auth/logout
Logout (requires auth).

### POST /auth/refresh-token
Get a new access token.

**Body:**
```json
{ "refreshToken": "refresh_token" }
```

### POST /auth/forgot-password
Send password reset email.

**Body:**
```json
{ "email": "john@example.com" }
```

### POST /auth/reset-password/:token
Reset password with token.

**Body:**
```json
{ "password": "newpassword123" }
```

---

## Product Endpoints

### GET /products
Get all products with optional filters.

**Query Params:**
- `keyword` - Search text
- `category` - Filter by category (t-shirts, shirts, pants, dresses, jackets, accessories)
- `minPrice`, `maxPrice` - Price range
- `size` - Filter by size (XS, S, M, L, XL, XXL)
- `color` - Filter by color
- `sort` - Sort field (default: `-createdAt`, options: `price`, `-price`, `-rating`)
- `page`, `limit` - Pagination
- `featured` - `true` to get featured products only

**Response:**
```json
{
  "success": true,
  "count": 12,
  "total": 25,
  "page": 1,
  "pages": 3,
  "products": [...]
}
```

### GET /products/:id
Get a single product by ID.

### POST /products (Admin)
Create a new product.

### PUT /products/:id (Admin)
Update a product.

### DELETE /products/:id (Admin)
Soft-delete a product.

### POST /products/:id/reviews (Auth)
Add a review to a product.

**Body:**
```json
{ "rating": 5, "comment": "Great product!" }
```

---

## User Endpoints

### GET /users/profile (Auth)
Get current user's profile with wishlist.

### PUT /users/profile (Auth)
Update profile (name, phone, avatar).

### PUT /users/change-password (Auth)
Change password.

**Body:**
```json
{ "currentPassword": "old", "newPassword": "new123" }
```

### GET /users/addresses (Auth)
Get saved addresses.

### POST /users/addresses (Auth)
Add a new address.

### DELETE /users/addresses/:id (Auth)
Remove an address.

### GET /users/wishlist (Auth)
Get wishlist products.

### POST /users/wishlist/:productId (Auth)
Add product to wishlist.

### DELETE /users/wishlist/:productId (Auth)
Remove product from wishlist.

---

## Cart Endpoints (Auth)

### GET /cart
Get current cart.

### POST /cart
Add item to cart.

**Body:**
```json
{ "productId": "...", "quantity": 1, "size": "M", "color": "Black" }
```

### PUT /cart/:itemId
Update item quantity.

**Body:**
```json
{ "quantity": 2 }
```

### DELETE /cart/:itemId
Remove item from cart.

### DELETE /cart
Clear entire cart.

---

## Order Endpoints

### POST /orders (Auth)
Create a new order.

**Body:**
```json
{
  "orderItems": [
    { "product": "id", "name": "Tee", "price": 20, "quantity": 2, "size": "M" }
  ],
  "shippingAddress": { "street": "...", "city": "...", "state": "NY", "zipCode": "10001", "country": "US" },
  "paymentMethod": "stripe"
}
```

### GET /orders (Auth)
Get current user's orders.

### GET /orders/admin (Admin)
Get all orders.

### GET /orders/:id (Auth)
Get a specific order.

### PUT /orders/:id/pay (Auth)
Mark order as paid.

### PUT /orders/:id/status (Admin)
Update order status.

**Body:**
```json
{ "status": "shipped", "trackingNumber": "TRK123" }
```

---

## Payment Endpoints

### POST /payment/create-payment-intent (Auth)
Create Stripe payment intent.

**Body:**
```json
{ "amount": 59.99, "currency": "usd" }
```

### POST /payment/process (Auth)
Process a payment.

**Body:**
```json
{ "amount": 59.99, "paymentMethodId": "pm_...", "orderId": "..." }
```

### POST /payment/webhook
Stripe webhook endpoint.

---

## Admin Endpoints (Admin Auth Required)

### GET /admin/analytics
Get dashboard analytics including total orders, revenue, users, products, recent orders, top products, and monthly revenue chart data.

### GET /admin/users
Get all users with pagination.

### PUT /admin/users/:id/toggle
Toggle user active status.
