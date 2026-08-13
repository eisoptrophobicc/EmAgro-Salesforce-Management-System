import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => {
  const refreshedToken =
    response.headers["x-access-token"];

  if (refreshedToken) {
    localStorage.setItem(
      "access_token",
      refreshedToken
    );
  }

  return response;
});

export default api;
