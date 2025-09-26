import axios from "axios";

const http = () => {
  let options = {
    baseURL: "https://fiftyfirstwellnessbackend-production.up.railway.app/api",
    // baseURL: "http://localhost:3000/api",
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
