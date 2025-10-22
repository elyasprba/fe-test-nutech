import axios from "axios";
import { store } from "../redux/store";
import { clearToken } from "../redux/auth-slice";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.data?.message === "Token expired")
    ) {
      store.dispatch(clearToken());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
