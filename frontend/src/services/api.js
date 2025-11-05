import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, //  Send cookies (refreshToken) with every request
});

// Store for auth callbacks
let authContext = null;

// Function to set auth context (called from App.jsx)
export const setAuthContext = (context) => {
	authContext = context;
};

//  Request interceptor to attach access token from memory
api.interceptors.request.use(
	(config) => {
		// Get access token from memory (AuthContext)
		const token = authContext?.accessToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
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
				.then(() => api(originalRequest))
				.catch((err) => Promise.reject(err));
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			//  Call refresh endpoint (refreshToken sent via cookie automatically)
			const response = await api.post('/user/refresh');

			//  Update access token in memory from response
			const newAccessToken = response.data.accessToken;
			if (authContext?.setAccessToken) {
				authContext.setAccessToken(newAccessToken);
			}

			// Process queued requests
			processQueue(null);

			isRefreshing = false;

			// Retry original request (with new access token)
			return api(originalRequest);
		} catch (refreshError) {
			// Refresh failed (refresh token expired), logout user
			processQueue(refreshError);
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

export const logoutUser = async () => {
	//  Access token sent via Authorization header, refreshToken via cookie
	const response = await api.post('/user/logout');
	return response.data;
};

export const getUserProfile = async () => {
	const response = await api.get('/user/profile');
	return response.data;
};
