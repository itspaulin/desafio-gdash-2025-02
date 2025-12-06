import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import {
  WeatherLogMongoSchema,
  WeatherLogSchema,
} from "../database/schemas/weather-log.schema";
import { WeatherIngestController } from "./controllers/weather-ingest.controller";
import { WeatherQueryController } from "./controllers/weather-query.controller";
import { WeatherExportCSVController } from "./controllers/weather-export-csv.controller";
import { WeatherExportXLSXController } from "./controllers/weather-export-xlsx.controller";
import { WeatherInsightsController } from "./controllers/weather-insights.controller";
import { WeatherAnalyticsController } from "./controllers/weather-analytics.controller";
import { WeatherDashboardController } from "./controllers/weather-dashboard.controller";
import { CreateWeatherLogUseCase } from "@/domain/application/use-cases/create-weather-log.use-case";
import { ListWeatherLogsUseCase } from "@/domain/application/use-cases/list-weather-logs.use-case";
import { ExportWeatherLogsCsvUseCase } from "@/domain/application/use-cases/export-weather-logs-csv.use-case";
import { ExportWeatherLogsXlsxUseCase } from "@/domain/application/use-cases/export-weather-logs-xlsx.use-case";
import { GenerateWeatherInsightsUseCase } from "@/domain/application/use-cases/generate-weather-insights.use-case";
import { CalculateWeatherStatisticsUseCase } from "@/domain/application/use-cases/calculate-weather-statistics.use-case";
import { DetectWeatherTrendsUseCase } from "@/domain/application/use-cases/detect-weather-trends.use-case";
import { GenerateWeatherAlertsUseCase } from "@/domain/application/use-cases/generate-weather-alerts.use-case";
import { GenerateWeatherSummaryUseCase } from "@/domain/application/use-cases/generate-weather-summary.use-case";
import { CalculateComfortIndexUseCase } from "@/domain/application/use-cases/calculate-comfort-index.use-case";
import { ClassifyWeatherDayUseCase } from "@/domain/application/use-cases/classify-weather-day.use-case";
import { WeatherLogRepository } from "@/domain/application/repositories/weather-log-repository";
import { MongoDBWeatherLogRepository } from "../database/repositories/mongodb-weather-log-repository";

import { UserSchema, UserModel } from "../database/schemas/user.schema";
import { AuthController } from "./controllers/auth.controller";
import { CreateUserController } from "./controllers/create-user.controller";
import { DeleteUserController } from "./controllers/delete-user.controller";
import { GetUserByIdController } from "./controllers/get-user-by-id.controller";
import { ListUsersController } from "./controllers/list-users.controller";
import { UpdateUserController } from "./controllers/update-user.controller";
import { CreateUserUseCase } from "@/domain/application/use-cases/create-user.use-case";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user.use-case";
import { GetUserByIdUseCase } from "@/domain/application/use-cases/get-user-by-id.use-case";
import { ListUsersUseCase } from "@/domain/application/use-cases/list-users.use-case";
import { UpdateUserUseCase } from "@/domain/application/use-cases/update-user.use-case";
import { DeleteUserUseCase } from "@/domain/application/use-cases/delete-user.use-case";
import { UserRepository } from "@/domain/application/repositories/user-repository";
import { MongoDBUserRepository } from "../database/repositories/mongodb-user-repository";
import { HashProvider } from "@/domain/application/providers/hash-provider";
import { DatabaseModule } from "../database/database.module";
import { BcryptHashProvider } from "../providers/hash.provider";
import { TokenProvider } from "@/domain/application/providers/token-provider";
import { JwtTokenProvider } from "../providers/token.provider";
import { SeedAdminService } from "../services/seed-admin.service";
import { AIInsightsProvider } from "@/domain/application/providers/ai-insights-provider";
import { GroqInsightsProvider } from "../providers/groq-insights.provider";
import { AIInsightsProviderChain } from "../providers/ai-insights-provider-chain";
import { GeminiInsightsProvider } from "../providers/gemini-insights.provider";
import { AIProvidersStatusController } from "./controllers/ai-providers-status.controller";
import { CacheService } from "./cache/cache.service";
import { CacheStatusController } from "./controllers/cache-status.controller";
import { CacheStatsController } from "./controllers/cache-stats.controller";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: WeatherLogSchema.name, schema: WeatherLogMongoSchema },
      { name: UserSchema.name, schema: UserModel },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET", "your-secret-key"),
        signOptions: {
          expiresIn: config.get("JWT_EXPIRES_IN", "7d"),
        },
      }),
    }),
  ],
  controllers: [
    WeatherIngestController,
    WeatherQueryController,
    WeatherExportCSVController,
    WeatherExportXLSXController,
    WeatherInsightsController,
    WeatherAnalyticsController,
    WeatherDashboardController,

    AuthController,
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    ListUsersController,
    UpdateUserController,

    AIProvidersStatusController,
    CacheStatusController,
    CacheStatsController,
  ],
  providers: [
    CreateWeatherLogUseCase,
    ListWeatherLogsUseCase,
    ExportWeatherLogsCsvUseCase,
    ExportWeatherLogsXlsxUseCase,
    ClassifyWeatherDayUseCase,
    GenerateWeatherInsightsUseCase,
    CalculateWeatherStatisticsUseCase,
    DetectWeatherTrendsUseCase,
    GenerateWeatherAlertsUseCase,
    CalculateComfortIndexUseCase,
    GenerateWeatherSummaryUseCase,
    SeedAdminService,
    CreateUserUseCase,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    CacheService,
    GroqInsightsProvider,
    GeminiInsightsProvider,
    AIInsightsProviderChain,
    {
      provide: UserRepository,
      useClass: MongoDBUserRepository,
    },
    {
      provide: HashProvider,
      useClass: BcryptHashProvider,
    },
    {
      provide: TokenProvider,
      useClass: JwtTokenProvider,
    },
    {
      provide: WeatherLogRepository,
      useClass: MongoDBWeatherLogRepository,
    },
    {
      provide: AIInsightsProvider,
      useClass: AIInsightsProviderChain,
    },
  ],
  exports: [JwtModule],
})
export class HttpModule {}
