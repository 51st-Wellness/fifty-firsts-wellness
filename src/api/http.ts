import axios, {
  type AxiosRequestConfig,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { getAuthToken } from "../lib/utils";
import { apiCache } from "../utils/apiCache";

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
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check cache for GET requests
    if (apiCache.shouldCache(config.method || "")) {
      const cacheKey = apiCache.generateKey(
        config.url || "",
        config.params
      );
      const cachedData = apiCache.get(cacheKey);

      if (cachedData) {
        // Return cached data by creating a fake response
        return Promise.reject({
          __cached: true,
          data: cachedData,
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to cache GET responses
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config;
    const method = config.method?.toLowerCase() || "";

    // Cache successful GET responses
    if (method === "get" && response.status === 200) {
      const cacheKey = apiCache.generateKey(config.url || "", config.params);
      // Cache for 5 minutes by default, can be customized per request
      const ttl = (config as any).cacheTTL || undefined;
      apiCache.set(cacheKey, response.data, ttl);
    }

    return response;
  },
  (error: any) => {
    // Handle cached responses
    if (error.__cached) {
      return Promise.resolve(error);
    }
    return Promise.reject(error);
  }
);

export default httpClient;
