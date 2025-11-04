# User Registration System - Backend

NestJS backend API for user registration with MongoDB.

## Features

- 🔐 Secure password hashing with bcrypt
- ✅ Input validation with class-validator
- 🗄️ MongoDB database with Mongoose
- 🌐 CORS enabled for frontend requests
- 🛡️ Error handling and validation
- ⚙️ Environment-based configuration

## Tech Stack

- NestJS
- MongoDB with Mongoose
- bcrypt for password hashing
- class-validator for validation
- @nestjs/config for environment variables

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/user-registration
PORT=3001
```

## Development

Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm run start:prod
```

## API Endpoints

### POST /user/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "email": "user@example.com",
    "createdAt": "2025-10-29T..."
  }
}
```

**Error Responses:**

409 Conflict - Email already exists:
```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

400 Bad Request - Validation error:
```json
{
  "statusCode": 400,
  "message": ["Email is required", "Password must be at least 6 characters long"]
}
```

## Project Structure

```
backend/
├── src/
│   ├── user/
│   │   ├── dto/
│   │   │   └── register-user.dto.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
└── package.json
```

## Database Schema

### User Collection

```typescript
{
  email: String (required, unique, lowercase)
  password: String (required, hashed)
  createdAt: Date (default: now)
}
```

## Security

- Passwords are hashed using bcrypt with 10 salt rounds
- Email uniqueness is enforced at database level
- Input validation using class-validator
- Environment variables for sensitive data

## Deployment

### Render (Recommended for MongoDB compatibility)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run start:prod`
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `PORT` - 3001 (or Render's default)

### Railway

1. Create new project on Railway
2. Add MongoDB service
3. Add Node.js service
4. Connect GitHub repository
5. Railway will auto-detect NestJS and deploy

### Heroku

1. Create Heroku app
2. Add MongoDB Atlas connection string
3. Deploy:
```bash
git push heroku main
```

## MongoDB Setup

### Local MongoDB

Install and run MongoDB locally:
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### MongoDB Atlas (Cloud)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-registration?retryWrites=true&w=majority
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3001)

## Testing the API

Using curl:
```bash
curl -X POST http://localhost:3001/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Using Postman:
1. Create POST request to `http://localhost:3001/user/register`
2. Set Content-Type to `application/json`
3. Add body: `{"email":"test@example.com","password":"password123"}`
