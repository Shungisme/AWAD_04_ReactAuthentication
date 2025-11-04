import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to JWT Authentication System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A complete authentication system with JWT access & refresh tokens
          </p>

          {isAuthenticated ? (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">
                ✓ You are logged in as {user?.email}
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Get Started - Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition duration-200"
                  >
                    Already have an account? Login
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">JWT Tokens</h3>
              <p className="text-sm text-gray-600">
                Access & refresh token authentication
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Auto Refresh</h3>
              <p className="text-sm text-gray-600">
                Seamless token refresh on expiry
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">React Query</h3>
              <p className="text-sm text-gray-600">
                Efficient server state management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
