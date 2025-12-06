import axios from "axios";

// Detecta o ambiente e configura a baseURL apropriada
const getBaseURL = (): string => {
  // Verifica se está em produção
  const isProd = process.env.NODE_ENV === "production";

  // Em produção (Docker), usa o proxy do Nginx
  if (isProd) {
    return "/api";
  }

  // Em desenvolvimento, usa a variável de ambiente ou localhost
  return process.env.VITE_API_URL || "http://localhost:3000";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição - adiciona token
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

// Interceptor de resposta - trata erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erro 401 - Não autorizado
    if (error.response?.status === 401) {
      console.warn(
        "⚠️ Token inválido ou expirado, redirecionando para login..."
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Erro 403 - Sem permissão
    if (error.response?.status === 403) {
      console.error("❌ Acesso negado");
    }

    // Erro 500 - Erro no servidor
    if (error.response?.status >= 500) {
      console.error("❌ Erro no servidor:", error.response.data);
    }

    // Erro de rede
    if (!error.response) {
      console.error("❌ Erro de rede - API indisponível");
    }

    return Promise.reject(error);
  }
);

export default api;
