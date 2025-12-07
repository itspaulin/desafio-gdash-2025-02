import { WeatherConditionFilter } from "@/types/filters";

export const weatherConditions: Record<string, string> = {
  clear: "Limpo",
  "clear sky": "Céu Limpo",
  cloudy: "Nublado",
  "partly cloudy": "Parcialmente Nublado",
  "mostly cloudy": "Muito Nublado",
  rainy: "Chuvoso",
  "light rain": "Chuva Leve",
  "heavy rain": "Chuva Forte",
  stormy: "Tempestuoso",
  overcast: "Encoberto",
  sunny: "Ensolarado",
};

export const translateWeatherCondition = (condition: string): string => {
  const normalized = condition.toLowerCase().trim();
  return weatherConditions[normalized] || condition;
};

export const weatherFilterLabels: Record<WeatherConditionFilter, string> = {
  all: "Todas as condições",
  clear: "Limpo",
  cloudy: "Nublado",
  rainy: "Chuvoso",
};
