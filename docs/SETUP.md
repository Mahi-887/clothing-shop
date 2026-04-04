# Setup Instructions

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Mahi-887/clothing-shop.git
cd clothing-shop
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your values
npm install
npm run dev
```

### 4. Seed Sample Data
```bash
cd database
node seeds.js
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/clothing_shop` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRE` | JWT expiration | `30d` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP email | `your@gmail.com` |
| `EMAIL_PASS` | SMTP password | `app-password` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend URL | `http://localhost:5000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_...` |

---

## Docker Setup

```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down
```

Services:
- MongoDB: `localhost:27017`
- Backend: `localhost:5000`
- Frontend: `localhost:3000`

---

## Creating an Admin User

1. Register a regular account through the UI or API
2. Access MongoDB and update the user's role:
```javascript
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the dashboard
3. Add them to `backend/.env`
4. For webhooks in development, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

---

## Production Deployment

### Backend (e.g., Railway, Render, Heroku)
1. Set all environment variables
2. Set `NODE_ENV=production`
3. Use a MongoDB Atlas connection string

### Frontend (e.g., Vercel)
1. Connect your GitHub repository
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy automatically on push

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start backend in development |
| `npm run dev:frontend` | Start frontend in development |
| `npm run dev` | Start both concurrently |
| `npm run build` | Build frontend for production |
