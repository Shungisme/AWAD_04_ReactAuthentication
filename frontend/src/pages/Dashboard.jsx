import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile, logoutUser } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, getRefreshToken } = useAuth();

  // Fetch user profile data
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    retry: 1,
  });

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 mb-6">
              {error.response?.data?.message || "Unable to load your profile"}
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! 👋</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-32 text-gray-600 font-medium">Email:</div>
                <div className="flex-1 text-gray-900">
                  {profile?.email || user?.email}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-32 text-gray-600 font-medium">
                  Member Since:
                </div>
                <div className="flex-1 text-gray-900">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-32 text-gray-600 font-medium">Status:</div>
                <div className="flex-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-purple-600 text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600 text-sm">
              Your session is protected with JWT tokens and automatic refresh.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-blue-600 text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Token Management
            </h3>
            <p className="text-gray-600 text-sm">
              Access tokens refresh automatically before expiration.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-green-600 text-3xl mb-3">🔄</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Multi-Tab Sync
            </h3>
            <p className="text-gray-600 text-sm">
              Logout in one tab reflects across all open tabs automatically.
            </p>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 Implementation Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                JWT Access Tokens (15 min expiry) stored in memory
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                JWT Refresh Tokens (7 days expiry) stored in localStorage
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                Axios interceptors for automatic token attachment
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                Automatic token refresh on 401 responses
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                React Query for server state management
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                React Hook Form for form validation
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                Protected routes with authentication guards
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                Multi-tab synchronization via Storage API
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
