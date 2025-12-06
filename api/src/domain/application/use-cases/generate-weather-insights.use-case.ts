import { Injectable } from "@nestjs/common";
import { WeatherLogRepository } from "../repositories/weather-log-repository";
import { Either, right } from "src/core/either";
import { AIInsightsProvider } from "../providers/ai-insights-provider";
import { Optional } from "@/core/@types/optional";

export interface GenerateWeatherInsightsUseCaseRequest {
  startDate?: Date;
  endDate?: Date;
  location?: string;
  limit?: number;
}

export interface WeatherInsight {
  summary: string;
  trends: string[];
  recommendations: string[];
  predictions: string[];
  anomalies: string[];
  generatedAt: Date;
  usedFallback?: boolean;
}

export interface GenerateWeatherInsightsUseCaseResponse {
  insights: WeatherInsight;
  dataPointsAnalyzed: number;
}

@Injectable()
export class GenerateWeatherInsightsUseCase {
  private insightCache = new Map<
    string,
    { data: WeatherInsight; timestamp: number }
  >();
  private readonly CACHE_TTL = 1000 * 60 * 30; // 30 minutos

  constructor(
    private weatherLogRepository: WeatherLogRepository,
    private aiInsightsProvider: AIInsightsProvider
  ) {}

  private getCacheKey(request: GenerateWeatherInsightsUseCaseRequest): string {
    return `${request.location || "global"}-${request.startDate?.toISOString() || "all"}-${request.endDate?.toISOString() || "all"}`;
  }

  private getCachedInsight(key: string): WeatherInsight | null {
    const cached = this.insightCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log("✅ Usando insight do cache");
      return cached.data;
    }
    return null;
  }

  private setCachedInsight(key: string, insight: WeatherInsight): void {
    this.insightCache.set(key, {
      data: insight,
      timestamp: Date.now(),
    });
  }

  async execute(
    request: GenerateWeatherInsightsUseCaseRequest
  ): Promise<Either<null, GenerateWeatherInsightsUseCaseResponse>> {
    // Verifica cache primeiro
    const cacheKey = this.getCacheKey(request);
    const cachedInsight = this.getCachedInsight(cacheKey);

    if (cachedInsight) {
      const result = await this.weatherLogRepository.findMany({
        page: 1,
        limit: request.limit || 100,
        startDate: request.startDate,
        endDate: request.endDate,
        location: request.location,
      });

      return right({
        insights: cachedInsight,
        dataPointsAnalyzed: result.data.length,
      });
    }

    // Busca dados meteorológicos
    const result = await this.weatherLogRepository.findMany({
      page: 1,
      limit: request.limit || 100,
      startDate: request.startDate,
      endDate: request.endDate,
      location: request.location,
    });

    if (result.data.length === 0) {
      return right({
        insights: {
          summary: "Nenhum dado disponível para análise.",
          trends: [],
          recommendations: [],
          predictions: [],
          anomalies: [],
          generatedAt: new Date(),
        },
        dataPointsAnalyzed: 0,
      });
    }

    const weatherData = result.data.map((log) => ({
      data: log.collectedAt.toISOString(),
      localizacao: log.location,
      temperatura: log.temperature,
      umidade: log.humidity,
      velocidadeVento: log.windSpeed,
      condicao: log.skyCondition,
      probabilidadeChuva: log.rainProbability,
    }));

    // Tenta gerar insights com IA
    let insightData: Optional<WeatherInsight, "generatedAt">;

    if (this.aiInsightsProvider.isAvailable()) {
      const aiInsights = await this.aiInsightsProvider.generateInsights(
        weatherData,
        request.location
      );

      if (aiInsights) {
        insightData = {
          ...aiInsights,
          usedFallback: false,
        };
      } else {
        // Fallback se a IA falhar
        insightData = this.generateStaticInsights(
          weatherData,
          request.location
        );
      }
    } else {
      // Fallback se a IA não estiver disponível
      insightData = this.generateStaticInsights(weatherData, request.location);
    }

    const insights: WeatherInsight = {
      ...insightData,
      generatedAt: new Date(),
    };

    // Cacheia o resultado
    this.setCachedInsight(cacheKey, insights);

    return right({
      insights,
      dataPointsAnalyzed: result.data.length,
    });
  }

  private generateStaticInsights(
    weatherData: any[],
    location?: string
  ): Optional<WeatherInsight, "generatedAt"> {
    // Calcula estatísticas básicas
    const temperatures = weatherData.map((d) => d.temperatura);
    const humidities = weatherData.map((d) => d.umidade);
    const windSpeeds = weatherData.map((d) => d.velocidadeVento);

    const avgTemp = (
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length
    ).toFixed(1);
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const avgHumidity = (
      humidities.reduce((a, b) => a + b, 0) / humidities.length
    ).toFixed(1);
    const avgWindSpeed = (
      windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length
    ).toFixed(1);

    // Identifica condições mais comuns
    const conditions = weatherData.map((d) => d.condicao);
    const conditionCounts = conditions.reduce(
      (acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const mostCommonCondition =
      Object.entries(conditionCounts).sort(
        (a, b) => (b[1] as number) - (a[1] as number)
      )[0]?.[0] || "variado";

    const locationText = location || "a região analisada";

    const summary = `Análise climática de ${locationText}: temperatura média de ${avgTemp}°C (variando entre ${minTemp}°C e ${maxTemp}°C), com condição predominante de ${mostCommonCondition}. Umidade média de ${avgHumidity}% e ventos a ${avgWindSpeed} km/h.`;

    const trends: string[] = [];

    if (maxTemp - minTemp > 10) {
      trends.push(
        `Alta amplitude térmica (${(maxTemp - minTemp).toFixed(1)}°C de variação)`
      );
    }

    if (parseFloat(avgHumidity) > 70) {
      trends.push("Umidade elevada no período analisado");
    } else if (parseFloat(avgHumidity) < 40) {
      trends.push("Umidade baixa no período analisado");
    }

    if (parseFloat(avgWindSpeed) > 20) {
      trends.push("Ventos fortes registrados no período");
    }

    const recommendations: string[] = [];

    if (parseFloat(avgTemp) > 30) {
      recommendations.push(
        "🌡️ Temperaturas elevadas: mantenha-se hidratado e evite exposição solar prolongada"
      );
    } else if (parseFloat(avgTemp) < 15) {
      recommendations.push(
        "🧥 Temperaturas baixas: vista-se adequadamente para se manter aquecido"
      );
    }

    if (parseFloat(avgHumidity) > 70) {
      recommendations.push(
        "💧 Alta umidade: prefira ambientes climatizados em horários de maior calor"
      );
    } else if (parseFloat(avgHumidity) < 40) {
      recommendations.push(
        "🏜️ Baixa umidade: aumente a ingestão de líquidos e use hidratante para pele"
      );
    }

    if (
      mostCommonCondition.toLowerCase().includes("rain") ||
      mostCommonCondition.toLowerCase().includes("chuva")
    ) {
      recommendations.push(
        "☔ Chuvas frequentes: tenha sempre um guarda-chuva à mão"
      );
    }

    const predictions: string[] = [
      "Padrões climáticos devem se manter similares aos observados",
      `Temperatura deve continuar em torno de ${avgTemp}°C`,
    ];

    const anomalies: string[] = [];

    if (maxTemp > 35) {
      anomalies.push(`Temperatura máxima elevada registrada: ${maxTemp}°C`);
    }
    if (minTemp < 10) {
      anomalies.push(`Temperatura mínima baixa registrada: ${minTemp}°C`);
    }
    if (parseFloat(avgWindSpeed) > 30) {
      anomalies.push(
        `Ventos muito fortes registrados (média de ${avgWindSpeed} km/h)`
      );
    }

    return {
      summary,
      trends,
      recommendations,
      predictions,
      anomalies,
      usedFallback: true,
    };
  }
}
