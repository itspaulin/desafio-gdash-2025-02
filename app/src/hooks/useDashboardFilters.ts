import { useState, useMemo } from "react";
import {
  DashboardFilters,
  MetricFilter,
  TimeOfDayFilter,
  WeatherConditionFilter,
} from "@/types/filters";
import { ChartDataPoint } from "@/types/weather";
import { DateRange } from "react-day-picker";

const defaultFilters: DashboardFilters = {
  dateRange: { type: "last7days" },
  metrics: ["temperature", "humidity", "windSpeed", "rainProbability"],
  timeOfDay: "all",
  weatherCondition: "all",
};

export function useDashboardFilters(rawData: ChartDataPoint[] | undefined) {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleDateRangeChange = (value: string) => {
    if (value === "last7days" || value === "last30days") {
      setFilters({
        ...filters,
        dateRange: { type: value },
      });
    } else if (value === "custom" && dateRange?.from && dateRange?.to) {
      setFilters({
        ...filters,
        dateRange: {
          type: "custom",
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        },
      });
    }
  };

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setFilters({
        ...filters,
        dateRange: {
          type: "custom",
          startDate: range.from.toISOString(),
          endDate: range.to.toISOString(),
        },
      });
    }
  };

  const handleMetricToggle = (metric: MetricFilter) => {
    const newMetrics = filters.metrics.includes(metric)
      ? filters.metrics.filter((m) => m !== metric)
      : [...filters.metrics, metric];

    setFilters({
      ...filters,
      metrics: newMetrics,
    });
  };

  const handleTimeOfDayChange = (value: TimeOfDayFilter) => {
    setFilters({
      ...filters,
      timeOfDay: value,
    });
  };

  const handleWeatherConditionChange = (value: WeatherConditionFilter) => {
    setFilters({
      ...filters,
      weatherCondition: value,
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setDateRange(undefined);
  };

  const getDate = (item: ChartDataPoint): Date => {
    if (item.rawDate) {
      return item.rawDate;
    }

    if (item.collectedAt) {
      return new Date(item.collectedAt);
    }

    try {
      const [datePart, timePart] = item.time.split(", ");
      const [day, month] = datePart.split("/").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);

      const now = new Date();
      const year = now.getFullYear();

      return new Date(year, month - 1, day, hour, minute);
    } catch (error) {
      return new Date();
    }
  };

  const getCondition = (item: ChartDataPoint): string => {
    return (item.condition || item.weatherLog?.skyCondition || "")
      .toLowerCase()
      .trim();
  };

  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) {
      return [];
    }

    let filtered = [...rawData];

    filtered.sort((a, b) => {
      const dateA = getDate(a).getTime();
      const dateB = getDate(b).getTime();
      return dateB - dateA;
    });

    const maxRecords =
      filters.dateRange.type === "last7days"
        ? Math.min(filtered.length, Math.ceil(filtered.length / 2))
        : filtered.length;

    filtered = filtered.slice(0, maxRecords);

    if (filters.timeOfDay !== "all") {
      filtered = filtered.filter((item) => {
        const date = getDate(item);

        if (isNaN(date.getTime())) {
          return false;
        }

        const hour = date.getHours();

        switch (filters.timeOfDay) {
          case "morning":
            return hour >= 6 && hour < 12;
          case "afternoon":
            return hour >= 12 && hour < 18;
          case "evening":
            return hour >= 18 && hour < 24;
          case "night":
            return hour >= 0 && hour < 6;
          default:
            return true;
        }
      });
    }

    if (filters.weatherCondition !== "all") {
      filtered = filtered.filter((item) => {
        const itemCondition = getCondition(item);
        const filterCondition = filters.weatherCondition.toLowerCase().trim();
        return itemCondition === filterCondition;
      });
    }

    return filtered;
  }, [rawData, filters]);

  return {
    filters,
    dateRange,
    filteredData,

    handleDateRangeChange,
    handleCustomDateSelect,
    handleMetricToggle,
    handleTimeOfDayChange,
    handleWeatherConditionChange,
    resetFilters,

    setFilters,
    setDateRange,
  };
}
