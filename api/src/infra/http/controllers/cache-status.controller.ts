import {
  Controller,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AIInsightsProviderChain } from "@/infra/providers/ai-insights-provider-chain";

@Controller("cache")
export class CacheStatusController {
  constructor(private aiProviderChain: AIInsightsProviderChain) {}

  @Get("status")
  @HttpCode(HttpStatus.OK)
  async getStatus() {
    return {
      message: "Cache Status",
      data: {
        enabled: true,
        ttl: "30 minutes",
        provider: "Redis",
      },
    };
  }

  @Delete("insights")
  @HttpCode(HttpStatus.OK)
  async clearInsightsCache() {
    await this.aiProviderChain.clearCache();
    return {
      message: "Cache de insights limpo com sucesso",
    };
  }

  @Delete("insights/:location")
  @HttpCode(HttpStatus.OK)
  async clearLocationCache(@Param("location") location: string) {
    await this.aiProviderChain.clearCache(location);
    return {
      message: `Cache de insights para '${location}' limpo com sucesso`,
    };
  }
}
