import axios, { type AxiosRequestConfig } from "axios";
import { getAuthToken } from "../lib/utils";

const http = () => {
  const options: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const token = getAuthToken();
  if (token) {
    (options.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }
  return axios.create(options);
};
export default http();
