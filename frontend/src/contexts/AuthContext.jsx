import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_REFRESH_THRESHOLD = 2 * 60 * 1000; // Refresh 2 minutes before expiry

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get refresh token from localStorage
  const getRefreshToken = useCallback(() => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }, []);

  // Store refresh token in localStorage
  const storeRefreshToken = useCallback((token) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      // Broadcast to other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: REFRESH_TOKEN_KEY,
          newValue: token,
          url: window.location.href,
        })
      );
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      // Broadcast to other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: REFRESH_TOKEN_KEY,
          newValue: null,
          url: window.location.href,
        })
      );
    }
  }, []);

  // Decode JWT token to get expiry
  const decodeToken = useCallback((token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }, []);

  // Check if token is expired or will expire soon
  const isTokenExpiringSoon = useCallback(
    (token) => {
      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) return true;

      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();
      return expiryTime - currentTime < TOKEN_REFRESH_THRESHOLD;
    },
    [decodeToken]
  );

  // Login function
  const login = useCallback(
    async (accessToken, refreshToken, userData) => {
      setAccessToken(accessToken);
      storeRefreshToken(refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
    },
    [storeRefreshToken]
  );

  // Logout function
  const logout = useCallback(() => {
    setAccessToken(null);
    storeRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, [storeRefreshToken]);

  // Update access token (used by axios interceptor)
  const updateAccessToken = useCallback((token) => {
    setAccessToken(token);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      // Will be handled by axios interceptor when first API call is made
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [getRefreshToken]);

  // Listen for storage events (multi-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === REFRESH_TOKEN_KEY) {
        if (!e.newValue) {
          // Logged out in another tab
          logout();
        } else if (e.newValue !== getRefreshToken()) {
          // Token updated in another tab
          setIsAuthenticated(true);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout, getRefreshToken]);

  const value = {
    accessToken,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateAccessToken,
    getRefreshToken,
    isTokenExpiringSoon,
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
