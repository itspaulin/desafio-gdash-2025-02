export interface WeatherDataPoint {
  data: string;
  localizacao: string;
  temperatura: number;
  umidade: number;
  velocidadeVento: number;
  condicao: string;
  probabilidadeChuva: number;
}

export interface AIInsightResponse {
  summary: string;
  trends: string[];
  recommendations: string[];
  predictions: string[];
  anomalies: string[];
}

export abstract class AIInsightsProvider {
  abstract generateInsights(
    weatherData: WeatherDataPoint[],
    location?: string
  ): Promise<AIInsightResponse | null>;

  abstract isAvailable(): boolean;
}
