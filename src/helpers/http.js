import axios from "axios";

const http = () => {
  let options = {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (localStorage.getItem("token")) {
    options.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "token"
    )}`;
  }
  return axios.create(options);
};
export default http;
