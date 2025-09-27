import axios from "axios";
import Cookies from "js-cookie";

const http = () => {
  let options = {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const token = Cookies.get("auth_token");
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }
  return axios.create(options);
};
export default http;
