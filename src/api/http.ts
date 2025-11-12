import axios, { type AxiosRequestConfig, type AxiosInstance } from "axios";
import { getAuthToken } from "../lib/utils";

// Create axios instance with base configuration
const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds timeout to prevent hanging requests
});

// Add request interceptor to dynamically add auth token to every request
httpClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
