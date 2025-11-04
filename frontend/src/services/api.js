import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Store for auth callbacks
let authContext = null;

// Function to set auth context (called from App.jsx)
export const setAuthContext = (context) => {
	authContext = context;
};

// Request interceptor to attach access token
api.interceptors.request.use(
	(config) => {
		if (authContext?.accessToken) {
			config.headers.Authorization = `Bearer ${authContext.accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If error is not 401 or request already retried, reject
		if (error.response?.status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		// If we're already refreshing, queue this request
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			})
				.then((token) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return api(originalRequest);
				})
				.catch((err) => Promise.reject(err));
		}

		originalRequest._retry = true;
		isRefreshing = true;

		const refreshToken = authContext?.getRefreshToken();

		if (!refreshToken) {
			// No refresh token, logout
			isRefreshing = false;
			authContext?.logout();
			return Promise.reject(error);
		}

		try {
			// Call refresh endpoint
			const response = await axios.post(`${API_URL}/user/refresh`, {
				refreshToken,
			});

			const { accessToken, refreshToken: newRefreshToken } = response.data;

			// Update tokens in auth context
			authContext?.updateAccessToken(accessToken);
			localStorage.setItem('refreshToken', newRefreshToken);

			// Update authorization header
			api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
			originalRequest.headers.Authorization = `Bearer ${accessToken}`;

			// Process queued requests
			processQueue(null, accessToken);

			isRefreshing = false;

			// Retry original request
			return api(originalRequest);
		} catch (refreshError) {
			// Refresh failed, logout user
			processQueue(refreshError, null);
			isRefreshing = false;
			authContext?.logout();
			return Promise.reject(refreshError);
		}
	}
);

// Auth API calls
export const registerUser = async (userData) => {
	const response = await api.post('/user/register', userData);
	return response.data;
};

export const loginUser = async (userData) => {
	const response = await api.post('/user/login', userData);
	return response.data;
};

export const logoutUser = async (refreshToken) => {
	const response = await api.post('/user/logout', { refreshToken });
	return response.data;
};

export const getUserProfile = async () => {
	const response = await api.get('/user/profile');
	return response.data;
};
