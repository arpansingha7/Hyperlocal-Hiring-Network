import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import axios from "axios";

const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (isDevelopment ? "http://localhost:4000" : "");
axios.defaults.baseURL = rawBaseUrl ? rawBaseUrl.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") : "";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

import { HelmetProvider } from "react-helmet-async";

export const Context = createContext({
  isAuthorized: false,
  isLoading: true,
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  return (
    <HelmetProvider>
      <Context.Provider
        value={{
          isAuthorized,
          setIsAuthorized,
          user,
          setUser,
          isLoading,
          setIsLoading,
        }}
      >
        <App />
      </Context.Provider>
    </HelmetProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
