import api from "./api";
import {
  WeatherLog,
  WeatherStatistics,
  WeatherTrend,
  WeatherAlert,
  WeatherInsight,
  WeatherDashboard,
} from "@/types/weather";

export const weatherService = {
  async getLogs(params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    const { data } = await api.get<{
      data: WeatherLog[];
      pagination: any;
    }>("/weather/logs", { params });
    return { logs: data.data, pagination: data.pagination };
  },

  async getStatistics(params?: { startDate?: string; endDate?: string }) {
    const { data } = await api.get<{ data: WeatherStatistics }>("/weather/analytics/statistics", {
      params,
    });
    return data.data;
  },

  async getTrends(params?: { startDate?: string; endDate?: string }) {
    const { data } = await api.get<{ data: { trends: WeatherTrend[] } }>(
      "/weather/analytics/trends",
      { params }
    );
    return data.data.trends;
  },

  async getAlerts() {
    const { data } = await api.get<{ data: { active: WeatherAlert[] } }>(
      "/weather/analytics/alerts"
    );
    return data.data.active;
  },

  async getInsights(params?: { regenerate?: boolean }) {
    console.log("🌐 weatherService.getInsights: GET request (cached)");
    const { data } = await api.get<{ data: WeatherInsight }>("/weather/insights", { params });
    console.log("📦 weatherService.getInsights: Response:", {
      generatedAt: data.data.generatedAt,
      summary: data.data.summary?.substring(0, 50),
    });
    return data.data;
  },

  async generateInsights() {
    console.log("🌐 weatherService.generateInsights: POST request (force regenerate)");
    console.log("📤 Endpoint: POST /weather/insights");

    // ADICIONE ESTE LOG ANTES DA CHAMADA
    console.log("🔍 Axios config:", {
      method: "POST",
      url: "/weather/insights",
    });

    const { data } = await api.post<{ data: WeatherInsight }>("/weather/insights");

    console.log("📦 Response:", data);
    return data.data;
  },

  async getDashboard(params?: {
    startDate?: string;
    endDate?: string;
    location?: string;
    recentLogsLimit?: number;
  }) {
    const { data } = await api.get<{ data: WeatherDashboard }>("/dashboard", {
      params,
    });
    return data.data;
  },

  async exportCSV(params?: { startDate?: string; endDate?: string }) {
    const response = await api.get("/weather/export/csv", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async exportXLSX(params?: { startDate?: string; endDate?: string }) {
    const response = await api.get("/weather/export/xlsx", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
