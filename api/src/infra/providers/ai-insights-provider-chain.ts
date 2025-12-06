import { Injectable } from "@nestjs/common";
import {
  AIInsightsProvider,
  AIInsightResponse,
  WeatherDataPoint,
} from "@/domain/application/providers/ai-insights-provider";
import { GroqInsightsProvider } from "./groq-insights.provider";
import { GeminiInsightsProvider } from "./gemini-insights.provider";

@Injectable()
export class AIInsightsProviderChain implements AIInsightsProvider {
  private providers: Array<{ name: string; provider: AIInsightsProvider }>;

  constructor(
    private groqProvider: GroqInsightsProvider,
    private geminiProvider: GeminiInsightsProvider
  ) {
    this.providers = [
      { name: "Groq", provider: this.groqProvider },
      { name: "Gemini", provider: this.geminiProvider },
    ];
  }

  isAvailable(): boolean {
    return this.providers.some((p) => p.provider.isAvailable());
  }

  async generateInsights(
    weatherData: WeatherDataPoint[],
    location?: string
  ): Promise<AIInsightResponse | null> {
    for (const { name, provider } of this.providers) {
      if (!provider.isAvailable()) {
        console.log(`${name} não disponível, tentando próximo provider...`);
        continue;
      }

      console.log(`Tentando gerar insights com ${name}...`);

      try {
        const result = await provider.generateInsights(weatherData, location);

        if (result) {
          console.log(`Insights gerados com sucesso usando ${name}`);
          return result;
        }

        console.warn(`${name} retornou null, tentando próximo provider...`);
      } catch (error) {
        console.error(`Erro ao usar ${name}:`, error);
      }
    }

    console.error("❌ Todos os providers de IA falharam");
    return null;
  }

  getProvidersStatus(): Array<{ name: string; available: boolean }> {
    return this.providers.map(({ name, provider }) => ({
      name,
      available: provider.isAvailable(),
    }));
  }
}
