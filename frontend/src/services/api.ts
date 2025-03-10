import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Function to refresh the token
async function refreshToken() {
  try {
    const response = await axios.post("http://localhost:3000/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });

    // Store the new access token
    localStorage.setItem("token", response.data.accessToken);

    return response.data.accessToken;
  } catch (error) {
    console.error("Erro ao renovar token", error);
    localStorage.clear();
    window.location.href = "/login"; // Redirect to login if refresh fails
  }
}

// Axios request interceptor
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config); // Retry the original request
      }
    }
    return Promise.reject(error);
  }
);

export default api;
