# 👗 FashionHub — E-Commerce Clothing Shop

A fully functional, production-ready e-commerce platform for selling clothing, built with Next.js, Express.js, and MongoDB.

## 🚀 Features

### Frontend
- 🏠 Home page with hero section, featured products, and testimonials
- 🛍️ Product catalog with search, filters (category, size, color, price range), and sorting
- 🔍 Product detail pages with image galleries and customer reviews
- 🛒 Shopping cart with persistent localStorage storage
- 💳 Multi-step checkout (shipping → review → payment)
- 👤 User authentication (register, login, logout)
- 👨‍💼 User profile management
- 📦 Order history and tracking
- ❤️ Wishlist functionality
- 📊 Admin dashboard with analytics, product management, order management
- 📱 Fully responsive design with Tailwind CSS

### Backend
- 🔐 JWT-based authentication with refresh tokens
- 50+ RESTful API endpoints
- Product CRUD with inventory tracking
- User management and profiles
- Shopping cart management
- Order processing and status tracking
- Stripe payment integration
- Email notifications (Nodemailer)
- Rate limiting, CORS, input validation
- Comprehensive error handling

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Axios |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Payments | Stripe |
| Email | Nodemailer |
| Deployment | Docker, Docker Compose |

## 📦 Getting Started

See [SETUP.md](docs/SETUP.md) for full setup instructions.

### Quick Start

```bash
# 1. Backend
cd backend && cp .env.example .env && npm install && npm run dev

# 2. Frontend (new terminal)
cd frontend && cp .env.local.example .env.local && npm install && npm run dev

# 3. Seed sample data (optional)
node database/seeds.js
```

### Docker

```bash
docker-compose up --build
```

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Database Schema](database/schema.md)

## 🛍️ Sample Products

The seed data includes 25+ products:

| Category | Items | Price Range |
|----------|-------|-------------|
| T-Shirts | Classic, Graphic, Premium, Vintage | $15–$25 |
| Shirts | Casual, Oxford, Formal, Striped | $30–$65 |
| Pants | Jeans, Chinos, Joggers, Trousers, Linen | $35–$70 |
| Dresses | Casual, Maxi, Party, Midi, Floral, Wrap | $55–$120 |
| Jackets | Denim, Leather, Windbreaker, Blazer, Hoodie | $45–$150 |

All products include multiple sizes (XS–XXL) and colors.

## 🔒 Security

- Password hashing with bcrypt (12 salt rounds)
- JWT access + refresh token authentication
- Input validation with Joi
- CORS restricted to frontend origin
- Rate limiting (100 req/15 min)
- No stack traces exposed in production

## 📁 Project Structure

```
clothing-shop/
├── frontend/          # Next.js frontend
│   ├── pages/         # Route pages
│   ├── components/    # Reusable components
│   ├── context/       # AuthContext, CartContext
│   ├── lib/           # API client
│   └── styles/        # Global CSS
├── backend/           # Express.js backend
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth, admin, error handling
│   ├── config/        # Database config
│   └── utils/         # Email, validation
├── database/          # Seeds and schema
├── docs/              # Documentation
└── docker-compose.yml
```

## 📜 License

MIT

---

Made with ❤️ for FashionHub
