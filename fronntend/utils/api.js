import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// Add request interceptor for debugging and JWT token
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Add JWT token to Authorization header if available
    const token = localStorage.getItem("blinkit_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and token handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error("❌ Backend server is not running or not accessible at http://localhost:5000");
      console.error("Please make sure the backend server is running on port 5000");
    } else if (error.response) {
      console.error(`API Error Response: ${error.response.status} - ${error.response.statusText}`);
      console.error("Error Data:", error.response.data);
      
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem("blinkit_token");
        // Optionally trigger logout in AuthContext
        if (window.location.pathname !== "/home" && window.location.pathname !== "/register") {
          window.location.href = "/home";
        }
      }
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
