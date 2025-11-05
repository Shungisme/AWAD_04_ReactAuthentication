import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null); //  Store access token in memory

  //  Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch user profile
        // If cookies are present and valid, this will succeed
        const response = await api.get('/user/profile');
        setUser({ email: response.data.email });
        setIsAuthenticated(true);
      } catch (error) {
        // No valid session, user not authenticated
        setUser(null);
        setIsAuthenticated(false);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (userData, token) => {
    //  Store access token in memory, refreshToken in httpOnly cookie (set by backend)
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    //  Clear access token from memory, cookies cleared by backend
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    setAccessToken, //  Expose setter for token refresh
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
