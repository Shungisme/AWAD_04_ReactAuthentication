# JWT Authentication System with React & NestJS

A production-ready, full-stack authentication system implementing **JWT access and refresh tokens** with a **hybrid storage approach**: access tokens in memory and refresh tokens in httpOnly cookies, featuring automatic token refresh, protected routes, and industry best practices.

🌐 **Live Demo**: [https://awad04.shung.site](https://awad04.shung.site)

## 🎯 Overview

This project implements **secure JWT authentication** with a **hybrid storage approach**:

- **Access Tokens** (15-minute expiry) stored in **memory (React state)**
- **Refresh Tokens** (7-day expiry) stored in **httpOnly cookies**
- **Automatic Token Refresh** via Axios interceptors
- **XSS Protection** - Refresh tokens in httpOnly cookies, access tokens in memory
- **CSRF Protection** - SameSite cookie attribute for refresh tokens
- **Protected Routes** with authentication guards
- **React Query** for efficient server state management
- **React Hook Form** for form validation
- **NestJS Backend** with JWT strategies and guards
- **MongoDB** for user storage (tokens NOT stored in DB)
- **cookie-parser** for server-side cookie management

## ✨ Key Features

### 🔐 Security-First Hybrid Authentication

✅ **Access Token in Memory** - Short-lived (15 min), cleared on tab close  
✅ **Refresh Token in HttpOnly Cookie** - Long-lived (7 days), XSS protected  
✅ **Secure Flag** - HTTPS-only transmission in production  
✅ **SameSite Attribute** - CSRF protection  
✅ **Stateless JWT** - No token storage in database  
✅ **Authorization Header** - Access token sent as Bearer token  

### Authentication Flow

✅ Complete login/logout mechanism with JWT tokens  
✅ Access token sent via Authorization header for API requests  
✅ Refresh token sent automatically via httpOnly cookie  
✅ Automatic refresh when access token expires  
✅ Cookies cleared on logout, memory cleared  

### Token Management

✅ **Access token** in memory (React Context state)  
✅ **Refresh token** in httpOnly cookie (XSS protected)  
✅ Access token attached to requests via Authorization header  
✅ Refresh token sent automatically by browser  
✅ **Tokens NOT stored in database** (stateless)  

### Axios Configuration

✅ Custom Axios instance with `withCredentials: true`  
✅ Cookies automatically sent by browser  
✅ Response interceptor handles 401 errors  
✅ Automatic token refresh on expiration  
✅ Request queue during refresh  
✅ **No request interceptor needed** - cookies sent automatically  

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
✅ Responsive design with Tailwind CSS  

### Error Handling

✅ Meaningful error messages  
✅ Graceful token expiration handling  
✅ Network error handling  
✅ Automatic logout on refresh failure  

### Production Ready

✅ Industry best practices  
✅ XSS protection with httpOnly  
✅ CSRF protection with SameSite  
✅ Secure cookie transmission  
✅ Clean, maintainable code  

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

Authenticate user and receive access token + refresh token cookie.

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
  "accessToken": "eyJhbGc..."
}
```

**Response Cookies:**
```
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

> **Note**: Access token returned in body (stored in memory), refresh token set as httpOnly cookie

#### POST /user/refresh

Refresh access token using refresh token from cookie.

**Request:** No body needed - refresh token sent via cookie

**Success Response (200):**

```json
{
  "message": "Tokens refreshed successfully",
  "accessToken": "eyJhbGc..."
}
```

**Response Cookies:**
```
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

> **Note**: New access token returned in body, new refresh token set as cookie

#### POST /user/logout

Clear authentication cookie and memory.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "message": "Logout successful"
}
```

**Response:** Clears refreshToken cookie (client clears accessToken from memory)

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

2. **Hybrid JWT Strategy**
   - Access token extracted from Authorization header (Bearer token)
   - Refresh token extracted from httpOnly cookie
   - Separate secrets for access and refresh tokens
   - User existence verification on each request

3. **Cookie Security Flags** (Refresh Token Only)
   - `httpOnly: true` - Prevents XSS attacks (JavaScript can't access)
   - `secure: true` - Only transmitted over HTTPS in production
   - `sameSite: 'lax'` - CSRF protection
   - Max-Age: 7 days (refresh token)

4. **No Database Token Storage**
   - JWT is stateless by design
   - Tokens are not stored in database
   - Validation via signature verification only

5. **Guards**
   - `JwtAuthGuard` for protected routes (validates access token from header)
   - `JwtRefreshGuard` for refresh endpoint (validates refresh token from cookie)
   - Automatic 401 responses for invalid tokens

### Frontend Security

1. **Hybrid Token Storage**
   - **Access token** in memory (React Context state) - cleared on tab close
   - **Refresh token** in httpOnly cookie - XSS protected, persists across sessions
   - No localStorage or sessionStorage usage

2. **Axios Configuration**
   - `withCredentials: true` - Enables cookie sending
   - Request interceptor attaches access token to Authorization header
   - Response interceptor handles 401 with automatic token refresh
   - New access token stored in memory after refresh

3. **Protected Routes**
   - Authentication check via `/user/profile` endpoint
   - Redirect to login if unauthenticated
   - Access token sent via Authorization header

## 🎨 User Flow

1. **Registration**

   - User visits `/signup`
   - Fills form with validation
   - Account created
   - Redirected to login
2. **Login**

   - User visits `/login`
   - Enters credentials
   - Receives accessToken in response body + refreshToken as httpOnly cookie
   - AccessToken stored in memory (React state)
   - Redirected to dashboard
3. **Dashboard Access**

   - Access token sent via Authorization header
   - Protected routes check authentication
   - Profile data fetched with access token
   - Refresh token sent automatically via cookie
4. **Token Refresh**

   - Access token expires (15 min)
   - API call returns 401
   - Axios interceptor catches error
   - Refresh token sent automatically via cookie
   - New access token returned in response and stored in memory
   - New refresh token set as cookie
   - Original request retried with new access token
   - User experiences no interruption
5. **Logout**

   - User clicks logout
   - Access token cleared from memory
   - Refresh token cookie cleared by server
   - Redirected to login

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

### 2. Test Login (receives access token + refresh cookie)

```bash
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

**Response includes:** `accessToken` in body, `refreshToken` in Set-Cookie header

### 3. Test Protected Endpoint (with access token)

```bash
# Extract access token from login response, then:
curl -X GET http://localhost:3001/user/profile \
  -H "Authorization: Bearer <access_token>"
```

### 4. Test Token Refresh (with refresh cookie)

```bash
curl -X POST http://localhost:3001/user/refresh \
  -b cookies.txt \
  -c cookies.txt
```

**Response includes:** New `accessToken` in body, new `refreshToken` in Set-Cookie header

### 5. Test Logout (with access token + cookie)

```bash
curl -X POST http://localhost:3001/user/logout \
  -H "Authorization: Bearer <access_token>" \
  -b cookies.txt
```

## 🛠️ Tech Stack

### Backend

- **NestJS 10.x** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport JWT** - JWT authentication strategy
- **@nestjs/jwt** - JWT token generation
- **bcrypt** - Password hashing
- **cookie-parser** - Parse and set cookies

### Frontend

- **React 18** - UI library
- **Vite 5** - Build tool
- **React Router DOM 6** - Routing
- **TanStack Query 5** - Server state management
- **React Hook Form 7** - Form validation
- **Axios** - HTTP client with credentials
- **Tailwind CSS 3** - Styling

## 📖 Learning Outcomes

This project demonstrates:

1. **Hybrid JWT Authentication Strategy**
   - Access token in memory (short-lived, 15 min)
   - Refresh token in httpOnly cookie (long-lived, 7 days)
   - Authorization header for API requests
   - Automatic token refresh flow
   - No database token storage (stateless)

2. **React State Management**
   - Context API for global auth state and token storage
   - React Query for server state
   - Memory-based access token management

3. **API Integration**
   - Axios with credentials support
   - Request interceptor for Authorization header
   - Response interceptor for automatic token refresh
   - Cookie and header-based authentication

4. **Security Best Practices**
   - Access token in memory (cleared on tab close)
   - Refresh token in httpOnly cookie (XSS protection)
   - SameSite attribute (CSRF protection)
   - Secure flag for HTTPS
   - Bearer token authentication
   - Stateless JWT validation

5. **Modern React Patterns**
   - Custom hooks
   - Component composition
   - Protected routes

## 🎓 Architecture Decisions

### Why Hybrid Approach (Memory + HttpOnly Cookie)?

**Access Token in Memory:**
- Short-lived (15 min) - minimal risk if compromised
- Cleared on tab close/refresh - temporary session
- Sent via Authorization header - standard Bearer token auth
- Fast access without cookie parsing

**Refresh Token in HttpOnly Cookie:**
- Long-lived (7 days) - better UX, persistent sessions
- httpOnly flag - JavaScript cannot access (XSS protection)
- SameSite attribute - CSRF attack mitigation
- Automatically sent by browser

**Best of Both Worlds:**
- Access token: Fast, standard, short-lived security
- Refresh token: XSS protected, persistent, long-lived

### Why NOT Store Tokens in Database?

- **JWT is stateless**: Designed to be self-contained
- **Performance**: No database lookup on every request
- **Scalability**: No additional database load
- **Simplicity**: Token validation via signature only

### Token Lifetimes

- **Access Token**: 15 minutes in memory (frequent validation)
- **Refresh Token**: 7 days in httpOnly cookie (balance security/UX)
- Failed refresh attempts clear memory and cookies

## 📚 Additional Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Apache deployment guide with SSL/HTTPS setup
- **[COOKIE_AUTH_GUIDE.md](./COOKIE_AUTH_GUIDE.md)** - Complete httpOnly cookie implementation guide
- **[QUICKSTART_COOKIES.md](./QUICKSTART_COOKIES.md)** - Quick reference for cookie-based auth
- **[JWT_BEST_PRACTICES.md](./JWT_BEST_PRACTICES.md)** - Why NOT to store JWT in database

## 🤝 Contributing

This is an educational project demonstrating hybrid JWT authentication with memory + httpOnly cookies.

## 📝 Notes

- **Access token** stored in memory (React Context state) - not persisted
- **Refresh token** stored in httpOnly cookie - XSS protected
- **No tokens in database** - stateless JWT validation
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Failed refresh attempts clear memory and cookies
- Authorization header used for access token (Bearer token)
- Cookie automatically sent for refresh token
- CORS credentials must be enabled on both frontend and backend

## 👨‍💻 Author

Created for AWAD IA04 Assignment - HK7 2025/2026

## 📄 License

Educational use only.
