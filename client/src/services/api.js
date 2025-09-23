import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5555/api", // adjust if your backend URL is different
});

export default api;
