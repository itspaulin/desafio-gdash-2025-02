import { Injectable, Inject } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.module";

@Injectable()
export class CacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Erro ao buscar cache [${key}]:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      console.error(`Erro ao salvar cache [${key}]:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`Erro ao deletar cache [${key}]:`, error);
    }
  }

  /**
   * Remove múltiplas chaves por padrão
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`🗑️ Removidas ${keys.length} chaves do padrão: ${pattern}`);
      }
    } catch (error) {
      console.error(`Erro ao deletar padrão [${pattern}]:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Erro ao verificar existência [${key}]:`, error);
      return false;
    }
  }

  async incr(key: string, ttlSeconds?: number): Promise<number> {
    try {
      const value = await this.redis.incr(key);
      if (ttlSeconds && value === 1) {
        await this.redis.expire(key, ttlSeconds);
      }
      return value;
    } catch (error) {}
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      console.error(`Erro ao buscar TTL [${key}]:`, error);
      return -2;
    }
  }
}
