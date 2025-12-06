import axios from "axios";

const getBaseURL = (): string => {
  const isProd = import.meta.env.MODE === "production";

  return isProd
    ? "/api"
    : import.meta.env.VITE_API_URL || "http://localhost:3000";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "⚠️ Token inválido ou expirado, redirecionando para login..."
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("❌ Acesso negado");
    }

    if (error.response?.status >= 500) {
      console.error("❌ Erro no servidor:", error.response.data);
    }

    if (!error.response) {
      console.error("❌ Erro de rede - API indisponível");
    }

    return Promise.reject(error);
  }
);

export default api;
