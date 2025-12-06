import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { AIInsightsProviderChain } from "@/infra/providers/ai-insights-provider-chain";

@Controller("ai/status")
export class AIProvidersStatusController {
  constructor(private aiProviderChain: AIInsightsProviderChain) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getStatus() {
    const providers = this.aiProviderChain.getProvidersStatus();
    const hasAnyAvailable = this.aiProviderChain.isAvailable();

    return {
      message: "AI Providers Status",
      data: {
        hasAnyAvailable,
        providers,
        fallbackMode: !hasAnyAvailable,
      },
    };
  }
}
