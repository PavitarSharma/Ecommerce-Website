/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const BASE_URL =import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.user?.token;


    if (token) {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);