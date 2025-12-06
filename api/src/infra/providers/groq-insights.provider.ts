import { Injectable } from "@nestjs/common";
import Groq from "groq-sdk";
import {
  AIInsightsProvider,
  AIInsightResponse,
  WeatherDataPoint,
} from "@/domain/application/providers/ai-insights-provider";

@Injectable()
export class GroqInsightsProvider implements AIInsightsProvider {
  private groq: Groq;
  private rateLimitReached = false;
  private rateLimitResetTime: Date | null = null;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || "",
    });
  }

  isAvailable(): boolean {
    if (!process.env.GROQ_API_KEY) {
      return false;
    }

    if (
      this.rateLimitReached &&
      this.rateLimitResetTime &&
      new Date() < this.rateLimitResetTime
    ) {
      console.warn("Groq rate limit ainda ativo");
      return false;
    }

    return true;
  }

  async generateInsights(
    weatherData: WeatherDataPoint[],
    location?: string
  ): Promise<AIInsightResponse | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const prompt = this.buildPrompt(weatherData, location);
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const content = chatCompletion.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Resposta vazia da IA");
      }

      this.rateLimitReached = false;
      this.rateLimitResetTime = null;

      const insights = JSON.parse(content);

      return {
        summary: insights.summary || "Análise indisponível",
        trends: insights.trends || [],
        recommendations: insights.recommendations || [],
        predictions: insights.predictions || [],
        anomalies: insights.anomalies || [],
      };
    } catch (error: any) {
      if (error.status === 429) {
        console.warn("⚠️ Rate limit do Groq atingido");

        const retryAfter = error.headers?.["retry-after"];
        if (retryAfter) {
          const seconds = parseInt(retryAfter, 10);
          this.rateLimitResetTime = new Date(Date.now() + seconds * 1000);
          console.warn(
            `Tentativa novamente após: ${this.rateLimitResetTime.toLocaleString()}`
          );
        }

        this.rateLimitReached = true;
      } else {
        console.error("Erro ao gerar insights com Groq:", error.message);
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
Responda APENAS com o JSON, sem texto adicional.`;
  }
}
