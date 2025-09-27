import axios from "axios";

const api = axios.create({
  baseURL: "https://jambostays-backend-v2.onrender.com/api", 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;