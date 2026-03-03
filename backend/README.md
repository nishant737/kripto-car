# Kripto Car Backend API

Backend API for Kripto Car Dealership Platform with dealer authentication.

## Features

- ✅ Dealer Registration
- ✅ Dealer Login
- ✅ JWT Authentication
- ✅ Password Hashing with bcrypt
- ✅ MongoDB Integration
- ✅ Protected Routes
- ✅ Input Validation
- ✅ Error Handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/kripto-car
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

3. Start MongoDB (make sure MongoDB is installed and running):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod
```

4. Run the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Dealer Authentication

#### Register Dealer
```
POST /api/dealer/register

Body:
{
  "email": "dealer@example.com",
  "phone": "1234567890",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "dealer": {
    "id": "dealer_id",
    "email": "dealer@example.com",
    "phone": "1234567890",
    "role": "dealer",
    "createdAt": "2026-02-28T..."
  }
}
```

#### Login Dealer
```
POST /api/dealer/login

Body:
{
  "email": "dealer@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "dealer": {
    "id": "dealer_id",
    "email": "dealer@example.com",
    "phone": "1234567890",
    "role": "dealer",
    "createdAt": "2026-02-28T..."
  }
}
```

#### Get Dealer Profile (Protected)
```
GET /api/dealer/profile

Headers:
Authorization: Bearer <jwt_token>

Response:
{
  "success": true,
  "dealer": {
    "id": "dealer_id",
    "email": "dealer@example.com",
    "phone": "1234567890",
    "role": "dealer",
    "createdAt": "2026-02-28T..."
  }
}
```

## Folder Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── dealerController.js # Business logic
├── middleware/
│   └── auth.js            # JWT authentication
├── models/
│   └── Dealer.js          # Dealer schema
├── routes/
│   └── dealerRoutes.js    # API routes
├── .env                   # Environment variables (gitignored)
├── .env.example           # Example env file
├── package.json
├── README.md
└── server.js              # Entry point
```

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token with 7-day expiration
- ✅ Password not returned in responses
- ✅ Email uniqueness validation
- ✅ Input validation
- ✅ Protected routes with JWT middleware
- ✅ CORS configuration

## Error Handling

All endpoints return proper HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5001/api/dealer/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dealer@test.com",
    "phone": "1234567890",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5001/api/dealer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dealer@test.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5001/api/dealer/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Next Steps

1. ✅ Backend API setup complete
2. ⏳ Frontend integration
3. ⏳ Booking system
4. ⏳ Dealer dashboard features

## License

MIT
