import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";

@Controller("cache/stats")
export class CacheStatsController {
  constructor(private cacheService: CacheService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getStats() {
    const pattern = "ai:insights:*";
    const keys = await this.getAllKeys(pattern);

    const stats = await Promise.all(
      keys.map(async (key) => {
        const ttl = await this.cacheService.ttl(key);
        return {
          key,
          ttlSeconds: ttl,
          expiresIn: this.formatTTL(ttl),
        };
      })
    );

    return {
      message: "Cache Statistics",
      data: {
        totalCachedInsights: keys.length,
        estimatedApiCallsSaved: keys.length,
        insights: stats,
      },
    };
  }

  private async getAllKeys(pattern: string): Promise<string[]> {
    try {
      const redis = (this.cacheService as any).redis;
      return await redis.keys(pattern);
    } catch {
      return [];
    }
  }

  private formatTTL(seconds: number): string {
    if (seconds < 0) return "expired";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }
}
