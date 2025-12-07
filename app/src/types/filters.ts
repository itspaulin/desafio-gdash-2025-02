export interface DashboardFilters {
  dateRange: DateRangeFilter;
  metrics: MetricFilter[];
  timeOfDay: TimeOfDayFilter;
  weatherCondition: WeatherConditionFilter;
  location?: string;
}

export type DateRangeFilter =
  | { type: "last7days" }
  | { type: "last30days" }
  | { type: "custom"; startDate: string; endDate: string };

export type MetricFilter = "temperature" | "humidity" | "windSpeed" | "rainProbability";

export type TimeOfDayFilter = "all" | "morning" | "afternoon" | "evening" | "night";

export type WeatherConditionFilter = "all" | "clear" | "cloudy" | "rainy";

export interface ChartConfig {
  type: "line" | "bar" | "area" | "pie" | "radar" | "scatter" | "heatmap" | "gauge";
  metrics: MetricFilter[];
  title: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: DashboardFilters;
  createdAt: string;
}

export interface PeriodComparison {
  period1: {
    startDate: string;
    endDate: string;
    data: any[];
  };
  period2: {
    startDate: string;
    endDate: string;
    data: any[];
  };
  metrics: {
    temperature: { change: number; changePercent: number };
    humidity: { change: number; changePercent: number };
    windSpeed: { change: number; changePercent: number };
    rainProbability: { change: number; changePercent: number };
  };
}
