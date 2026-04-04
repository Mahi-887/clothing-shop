# Database Schema

## Collections

### Users
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (hashed, required)
- `role`: String (`user` | `admin`, default: `user`)
- `phone`: String
- `avatar`: String (URL)
- `addresses`: Array of address objects
  - `street`, `city`, `state`, `zipCode`, `country`, `isDefault`
- `wishlist`: Array of Product ObjectIds
- `cart`: Array of cart items
  - `product` (Product ref), `quantity`, `size`, `color`
- `isActive`: Boolean
- `refreshToken`: String
- `passwordResetToken`: String
- `passwordResetExpires`: Date
- `createdAt`, `updatedAt`: Date

### Products
- `_id`: ObjectId
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `category`: String (enum: t-shirts, shirts, pants, dresses, jackets, accessories)
- `images`: Array of Strings (URLs)
- `sizes`: Array of `{ size, stock }` objects
- `colors`: Array of Strings
- `brand`: String
- `tags`: Array of Strings
- `reviews`: Array of embedded review objects
- `rating`: Number (computed average)
- `numReviews`: Number
- `totalStock`: Number (computed sum of size stocks)
- `isActive`: Boolean
- `isFeatured`: Boolean
- `discount`: Number (0–100)
- `sku`: String (unique)
- `createdAt`, `updatedAt`: Date

### Orders
- `_id`: ObjectId
- `user`: User ObjectId (ref)
- `orderItems`: Array of order item objects
  - `product` (ref), `name`, `image`, `price`, `size`, `color`, `quantity`
- `shippingAddress`: address object
- `paymentMethod`: String (stripe | paypal | cod)
- `paymentResult`: Object (id, status, updateTime, emailAddress)
- `itemsPrice`, `shippingPrice`, `taxPrice`, `totalPrice`: Number
- `isPaid`: Boolean
- `paidAt`: Date
- `status`: String (pending | processing | shipped | delivered | cancelled)
- `deliveredAt`: Date
- `trackingNumber`: String
- `notes`: String
- `createdAt`, `updatedAt`: Date

### Reviews
- `_id`: ObjectId
- `user`: User ObjectId (ref)
- `product`: Product ObjectId (ref)
- `order`: Order ObjectId (ref)
- `rating`: Number (1–5)
- `title`: String
- `comment`: String
- `isApproved`: Boolean
- `helpfulVotes`: Number
- `createdAt`, `updatedAt`: Date

## Indexes
- `users.email`: unique
- `products`: text index on name, description, tags
- `reviews`: compound unique index on user + product
