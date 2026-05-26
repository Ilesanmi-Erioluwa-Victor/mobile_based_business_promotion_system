import axios from "axios";
import loadingService from "./loadingService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    // show global loading for each outgoing request
    loadingService.show();
    const token = localStorage.getItem("bizpromo_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // ensure loading state is cleaned up on request error
    loadingService.hide();
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    loadingService.hide();
    return response;
  },
  (error) => {
    loadingService.hide();
    if (error.response?.status === 401) {
      localStorage.removeItem("bizpromo_token");
      localStorage.removeItem("bizpromo_user");
      if (window.location.pathname !== "/login")
        window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
