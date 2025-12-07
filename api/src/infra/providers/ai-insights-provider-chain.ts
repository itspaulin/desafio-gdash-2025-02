import { Injectable } from "@nestjs/common";
import {
  AIInsightsProvider,
  AIInsightResponse,
  WeatherDataPoint,
} from "@/domain/application/providers/ai-insights-provider";
import { GroqInsightsProvider } from "./groq-insights.provider";
import { GeminiInsightsProvider } from "./gemini-insights.provider";
import { createHash } from "crypto";
import { CacheService } from "../http/cache/cache.service";

@Injectable()
export class AIInsightsProviderChain implements AIInsightsProvider {
  private providers: Array<{ name: string; provider: AIInsightsProvider }>;
  private readonly CACHE_TTL = 30 * 60;
  private readonly CACHE_PREFIX = "ai:insights:";

  constructor(
    private groqProvider: GroqInsightsProvider,
    private geminiProvider: GeminiInsightsProvider,
    private cacheService: CacheService
  ) {
    this.providers = [
      { name: "Groq", provider: this.groqProvider },
      { name: "Gemini", provider: this.geminiProvider },
    ];
  }

  isAvailable(): boolean {
    return this.providers.some((p) => p.provider.isAvailable());
  }

  private generateCacheKey(weatherData: WeatherDataPoint[], location?: string): string {
    const dataHash = createHash("md5")
      .update(JSON.stringify({ weatherData, location }))
      .digest("hex")
      .substring(0, 16);

    return `${this.CACHE_PREFIX}${location || "default"}:${dataHash}`;
  }

  async generateInsights(
    weatherData: WeatherDataPoint[],
    location?: string
  ): Promise<AIInsightResponse | null> {
    const cacheKey = this.generateCacheKey(weatherData, location);
    const cached = await this.cacheService.get<AIInsightResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    for (const { name, provider } of this.providers) {
      if (!provider.isAvailable()) {
        continue;
      }

      try {
        const result = await provider.generateInsights(weatherData, location);

        if (result) {
          await this.cacheService.set(cacheKey, result, this.CACHE_TTL);
          return result;
        }

        console.warn(`${name} retornou null, tentando próximo provider...`);
      } catch (error) {
        console.error(`Erro ao usar ${name}:`, error);
      }
    }

    console.error("Todos os providers de IA falharam");
    return null;
  }

  getProvidersStatus(): Array<{ name: string; available: boolean }> {
    return this.providers.map(({ name, provider }) => ({
      name,
      available: provider.isAvailable(),
    }));
  }

  async clearCache(location?: string): Promise<void> {
    const pattern = location ? `${this.CACHE_PREFIX}${location}:*` : `${this.CACHE_PREFIX}*`;
    await this.cacheService.delPattern(pattern);
  }
}
