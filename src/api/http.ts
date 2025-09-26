import axios, { type AxiosRequestConfig } from "axios";

const http = () => {
  const options: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    (options.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }
  return axios.create(options);
};
export default http();
