export interface DashboardFilters {
  dateRange: DateRangeFilter;
  metrics: MetricFilter[];
  timeOfDay: TimeOfDayFilter;
  weatherCondition: WeatherConditionFilter; // ✅ NOVO
  location?: string;
}

export type DateRangeFilter =
  | { type: "last7days" }
  | { type: "last30days" }
  | { type: "custom"; startDate: string; endDate: string }; // ✅ NOVO

export type MetricFilter =
  | "temperature"
  | "humidity"
  | "windSpeed"
  | "rainProbability";

export type TimeOfDayFilter =
  | "all"
  | "morning"
  | "afternoon"
  | "evening"
  | "night";

export type WeatherConditionFilter = "all" | "clear" | "cloudy" | "rainy"; // ✅ NOVO

export interface ChartConfig {
  type:
    | "line"
    | "bar"
    | "area"
    | "pie"
    | "radar"
    | "scatter"
    | "heatmap"
    | "gauge"; // ✅ NOVO
  metrics: MetricFilter[];
  title: string;
}

// ✅ NOVO: Filtros favoritos
export interface SavedFilter {
  id: string;
  name: string;
  filters: DashboardFilters;
  createdAt: string;
}

// ✅ NOVO: Comparação de períodos
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
