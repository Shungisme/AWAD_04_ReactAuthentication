# User Registration System - Frontend

React-based frontend for the User Registration System.

## Features

- ✨ Modern UI with Tailwind CSS
- 🔄 React Router for navigation
- 📝 Form validation with React Hook Form
- 🔌 API integration with React Query
- 🎨 Responsive design
- ⚡ Fast development with Vite

## Tech Stack

- React 18
- Vite
- React Router DOM
- React Hook Form
- React Query (TanStack Query)
- Tailwind CSS
- Axios

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:

```
VITE_API_URL=http://localhost:3001
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── SignUp.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
└── package.json
```

## Available Routes

- `/` - Home page
- `/login` - Login page
- `/signup` - Sign up page

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` - Your backend API URL

### Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)
