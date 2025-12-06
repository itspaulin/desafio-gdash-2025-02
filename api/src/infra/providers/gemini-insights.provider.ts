import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AIInsightsProvider,
  AIInsightResponse,
  WeatherDataPoint,
} from "@/domain/application/providers/ai-insights-provider";

@Injectable()
export class GeminiInsightsProvider implements AIInsightsProvider {
  private genAI: GoogleGenerativeAI | null = null;
  private rateLimitReached = false;
  private rateLimitResetTime: Date | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  isAvailable(): boolean {
    if (!this.genAI) {
      return false;
    }

    if (
      this.rateLimitReached &&
      this.rateLimitResetTime &&
      new Date() < this.rateLimitResetTime
    ) {
      console.warn("Gemini rate limit ainda ativo");
      return false;
    }

    return true;
  }

  async generateInsights(
    weatherData: WeatherDataPoint[],
    location?: string
  ): Promise<AIInsightResponse | null> {
    if (!this.isAvailable() || !this.genAI) {
      return null;
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      });

      const prompt = this.buildPrompt(weatherData, location);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Resposta vazia da IA");
      }

      this.rateLimitReached = false;
      this.rateLimitResetTime = null;

      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
      const insights = JSON.parse(cleanText);

      return {
        summary: insights.summary || "Análise indisponível",
        trends: insights.trends || [],
        recommendations: insights.recommendations || [],
        predictions: insights.predictions || [],
        anomalies: insights.anomalies || [],
      };
    } catch (error: any) {
      const isRateLimit =
        error.status === 429 ||
        error.message?.includes("RESOURCE_EXHAUSTED") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit");

      if (isRateLimit) {
        console.warn("Rate limit do Gemini atingido");

        this.rateLimitResetTime = new Date(Date.now() + 60 * 60 * 1000);
        console.warn(
          `⏰ Tentativa novamente após: ${this.rateLimitResetTime.toLocaleString()}`
        );

        this.rateLimitReached = true;
      } else {
        console.error("Erro ao gerar insights com Gemini:", error.message);
      }

      return null;
    }
  }

  private buildPrompt(
    weatherData: WeatherDataPoint[],
    location?: string
  ): string {
    const locationText = location || "a região";
    const dataJson = JSON.stringify(weatherData, null, 2);

    return `Você é um especialista em meteorologia e análise de dados climáticos. 

    Analise os seguintes dados climáticos de ${locationText}:

    ${dataJson}

    Com base nesses dados, forneça uma análise detalhada em formato JSON com a seguinte estrutura:

    {
      "summary": "Um resumo executivo do clima no período analisado (2-3 frases)",
      "trends": ["Array de tendências observadas nos dados"],
      "recommendations": ["Array de recomendações práticas baseadas nos padrões identificados"],
      "predictions": ["Array de previsões ou expectativas para os próximos dias"],
      "anomalies": ["Array de anomalias ou padrões incomuns detectados"]
    }

    Seja específico, use números e dados concretos, e forneça insights acionáveis.
    Responda APENAS com o JSON válido, sem texto adicional antes ou depois.`;
  }
}
