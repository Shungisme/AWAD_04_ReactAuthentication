# JWT Authentication System with React & NestJS

A production-ready, full-stack authentication system implementing **JWT access and refresh tokens** with automatic token refresh, protected routes, and multi-tab synchronization.

## 🎯 Overview

This project is an **implementation** of secure JWT authentication featuring:

- **Access Tokens** (15-minute expiry) stored in memory
- **Refresh Tokens** (7-day expiry) stored in localStorage
- **Automatic Token Refresh** via Axios interceptors
- **Protected Routes** with authentication guards
- **React Query** for efficient server state management
- **React Hook Form** for form validation
- **Multi-Tab Synchronization** for logout events
- **NestJS Backend** with JWT strategies and guards
- **MongoDB** for user and token storage

## ✨ Key Features

### Authentication Flow

✅ Complete login/logout mechanism with JWT tokens  
✅ Access token for authorized API requests  
✅ Automatic refresh when access token expires  
✅ Token invalidation on logout  

### Token Management

✅ Access tokens stored in memory (secure)  
✅ Refresh tokens in localStorage (persistent)  
✅ All tokens cleared on logout  
✅ Refresh tokens stored in database  

### Axios Configuration

✅ Custom Axios instance for API calls  
✅ Request interceptor attaches access token  
✅ Response interceptor handles 401 errors  
✅ Automatic token refresh on expiration  
✅ Request queue during refresh  

### React Query Integration

✅ `useMutation` for login/logout  
✅ `useQuery` for protected data fetching  
✅ Query invalidation on auth state changes  
✅ Optimized caching and refetching  

### React Hook Form Integration

✅ Complete form management  
✅ Email and password validation  
✅ Real-time error display  
✅ Integration with React Query mutations  

### Protected Routes

✅ Authentication-required routes  
✅ Automatic redirect to login  
✅ Return to intended destination after login  
✅ Loading state during auth check  

### User Interface

✅ Beautiful login/signup pages  
✅ Protected dashboard with user info  
✅ Logout button with proper cleanup  
✅ Success/error feedback  
✅ Responsive design  

### Error Handling

✅ Meaningful error messages  
✅ Graceful token expiration handling  
✅ Network error handling  
✅ Automatic logout on refresh failure  

### Stretch Goals (Bonus)

✅ Multi-tab synchronization via Storage API  
✅ Clean token management architecture  
✅ Modular and maintainable code  

## 📁 Project Structure

```
IA_04/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/         # JWT strategies and guards
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-refresh.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt-refresh.guard.ts
│   │   ├── user/         # User module
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.module.ts
│   │   │   ├── dto/
│   │   │   └── schemas/user.schema.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/             # React App
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AuthInitializer.jsx
│   │   ├── contexts/     # Auth context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/        # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/     # API integration
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json       # Deployment config
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/user-registration
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

5. Start the development server:

```bash
npm run start:dev
```

Backend API runs at `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update `.env`:

```env
VITE_API_URL=http://localhost:3001
```

5. Start the development server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## 📊 API Documentation

### Authentication Endpoints

#### POST /user/register

Register a new user account.

**Request:**

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
    "createdAt": "2025-11-04T12:00:00.000Z"
  }
}
```

#### POST /user/login

Authenticate user and receive tokens.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /user/refresh

Refresh access token using refresh token.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /user/logout

Invalidate refresh token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "message": "Logout successful"
}
```

#### GET /user/profile

Get authenticated user's profile (Protected).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "email": "user@example.com",
  "createdAt": "2025-11-04T12:00:00.000Z"
}
```

## 🔐 Security Implementation

### Backend Security

1. **Password Hashing**

   - bcrypt with 10 salt rounds
   - Never store plain text passwords
2. **JWT Strategy**

   - Separate secrets for access and refresh tokens
   - Token type validation in strategies
   - User existence verification
3. **Token Storage**

   - Refresh tokens stored in database array
   - Token validation on refresh
   - Token removal on logout
4. **Guards**

   - `JwtAuthGuard` for protected routes
   - `JwtRefreshGuard` for refresh endpoint
   - Automatic 401 responses for invalid tokens

### Frontend Security

1. **Token Storage**

   - Access token in memory (React state)
   - Refresh token in localStorage
   - No sensitive data in session storage
2. **Axios Interceptors**

   - Automatic token attachment
   - 401 error handling
   - Token refresh queue management
3. **Protected Routes**

   - Authentication check before render
   - Redirect to login if unauthenticated
   - Return to intended route after login

## 🎨 User Flow

1. **Registration**

   - User visits `/signup`
   - Fills form with validation
   - Account created
   - Redirected to login
2. **Login**

   - User visits `/login`
   - Enters credentials
   - Receives access + refresh tokens
   - Redirected to dashboard
3. **Dashboard Access**

   - Protected route checks authentication
   - Access token attached to API calls
   - User data displayed
   - Can logout
4. **Token Refresh**

   - Access token expires (15 min)
   - API call returns 401
   - Axios interceptor catches error
   - Refresh token used automatically
   - New tokens obtained
   - Original request retried
   - User experiences no interruption
5. **Logout**

   - User clicks logout
   - Refresh token invalidated in DB
   - All tokens cleared
   - Redirected to login
   - Other tabs receive logout event

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

**Environment Variables:**

- `VITE_API_URL` - Your deployed backend URL

### Backend Deployment (Railway/Render)

**Railway:**

```bash
cd backend
railway login
railway init
railway up
```

**Render:**

1. Connect GitHub repository
2. Build: `npm install && npm run build`
3. Start: `npm run start:prod`

**Environment Variables:**

- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key
- `JWT_REFRESH_SECRET` - Different strong secret key
- `PORT` - 3001

### MongoDB Setup (MongoDB Atlas)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Update `MONGODB_URI` in environment variables

## 🧪 Testing the Application

### 1. Test Registration

```bash
curl -X POST http://localhost:3001/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Login

```bash
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Protected Endpoint

```bash
curl -X GET http://localhost:3001/user/profile \
  -H "Authorization: Bearer <access_token>"
```

### 4. Test Token Refresh

```bash
curl -X POST http://localhost:3001/user/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

### 5. Test Logout

```bash
curl -X POST http://localhost:3001/user/logout \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

## 🛠️ Tech Stack

### Backend

- **NestJS 10.x** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport JWT** - JWT authentication strategy
- **@nestjs/jwt** - JWT token generation
- **bcrypt** - Password hashing

### Frontend

- **React 18** - UI library
- **Vite 5** - Build tool
- **React Router DOM 6** - Routing
- **TanStack Query 5** - Server state management
- **React Hook Form 7** - Form validation
- **Axios** - HTTP client
- **Tailwind CSS 3** - Styling

## 📖 Learning Outcomes

This project demonstrates:

1. **JWT Authentication Patterns**

   - Access and refresh token flow
   - Token expiration handling
   - Secure token storage
2. **React State Management**

   - Context API for global state
   - React Query for server state
   - Local state for UI
3. **API Integration**

   - Axios interceptors
   - Request/response transformation
   - Error handling
4. **Security Best Practices**

   - No tokens in URLs or session storage
   - Proper token invalidation
   - CORS configuration
5. **Modern React Patterns**

   - Custom hooks
   - Component composition
   - Protected routes

## 🎓 Architecture Decisions

### Why Access + Refresh Tokens?

- **Access tokens** are short-lived (15 min) for security
- **Refresh tokens** are long-lived (7 days) for convenience
- Compromised access token expires quickly
- Refresh token stored securely can be revoked

### Why Memory for Access Token?

- Cleared on tab close/refresh
- Not accessible to XSS attacks
- Most secure storage option
- Brief inconvenience on refresh acceptable

### Why localStorage for Refresh Token?

- Persists across sessions
- Allows "remember me" functionality
- Can be synced across tabs
- Acceptable risk vs usability

## 🤝 Contributing

This is an educational project demonstrating JWT authentication patterns.

## 📝 Notes

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Failed refresh attempts log user out
- Multi-tab logout synchronization included
- All tokens stored in database for revocation

## 👨‍💻 Author

Created for AWAD IA04 Assignment - HK7 2025/2026

## 📄 License

Educational use only.
