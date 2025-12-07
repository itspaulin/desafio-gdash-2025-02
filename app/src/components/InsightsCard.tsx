import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { WeatherInsight } from "@/types/weather";

interface InsightsCardProps {
  insights: WeatherInsight | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

const weatherConditions: Record<string, string> = {
  clear: "céu limpo",
  "partly cloudy": "parcialmente nublado",
  "partially cloudy": "parcialmente nublado",
  cloudy: "nublado",
  overcast: "encoberto",
  rain: "chuva",
  drizzle: "chuvisco",
  thunderstorm: "tempestade",
  snow: "neve",
  fog: "neblina",
  mist: "névoa",
  sunny: "ensolarado",
};

const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const improveInsightText = (text: string): string => {
  let improved = text;

  Object.entries(weatherConditions).forEach(([eng, pt]) => {
    const regex = new RegExp(`'${eng}'`, "gi");
    improved = improved.replace(regex, `"${pt}"`);
  });

  const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g;
  improved = improved.replace(isoDateRegex, (match) => formatDateTime(match));

  return improved;
};

export function InsightsCard({ insights, isLoading, onRegenerate }: InsightsCardProps) {
  if (!insights) {
    return null;
  }

  const getTrendIcon = (direction: string) => {
    if (direction === "rising") return <TrendingUp className="h-4 w-4" />;
    if (direction === "falling") return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getAlertIcon = (type: string) => {
    if (type === "danger") return <AlertCircle className="h-5 w-5" />;
    if (type === "warning") return <AlertTriangle className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };

  const hasTrends = insights.trends && Array.isArray(insights.trends) && insights.trends.length > 0;

  const trendsAreStructured =
    hasTrends && typeof insights.trends[0] === "object" && insights.trends[0].metric;

  const hasAlerts = insights.alerts && Array.isArray(insights.alerts) && insights.alerts.length > 0;

  const hasRecommendations =
    insights.recommendations &&
    Array.isArray(insights.recommendations) &&
    insights.recommendations.length > 0;

  const hasPredictions =
    insights.predictions && Array.isArray(insights.predictions) && insights.predictions.length > 0;

  const hasAnomalies =
    insights.anomalies && Array.isArray(insights.anomalies) && insights.anomalies.length > 0;

  const improvedSummary = improveInsightText(insights.summary);

  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-foreground">Insights de IA</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
            className="border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Regenerar
          </Button>
        </div>
        <CardDescription className="dark:text-blue-100 leading-relaxed text-base mt-3">
          {improvedSummary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Trends - formato estruturado */}
        {hasTrends && trendsAreStructured && (
          <div>
            <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Tendências
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {insights.trends.map((trend: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                    {getTrendIcon(trend.direction)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize text-foreground">
                      {trend.metric.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {improveInsightText(trend.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trends - formato simples (strings) */}
        {hasTrends && !trendsAreStructured && (
          <div>
            <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Tendências
            </h4>
            <ul className="space-y-2">
              {insights.trends.map((trend: any, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-500 mt-1 font-bold">•</span>
                  <span className="flex-1">{improveInsightText(trend)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alerts */}
        {hasAlerts && (
          <div>
            <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              Alertas
            </h4>
            <div className="space-y-2">
              {insights.alerts?.map((alert: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-shadow hover:shadow-md ${
                    alert.type === "danger"
                      ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                      : alert.type === "warning"
                        ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900"
                        : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                  }`}
                >
                  <div
                    className={`mt-0.5 ${
                      alert.type === "danger"
                        ? "text-red-600 dark:text-red-400"
                        : alert.type === "warning"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {improveInsightText(alert.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {hasRecommendations && (
          <div>
            <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
              Recomendações
            </h4>
            <ul className="space-y-2">
              {insights.recommendations.map((rec: any, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 mt-1 font-bold">•</span>
                  <span className="flex-1">{improveInsightText(rec)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Predictions */}
        {hasPredictions && (
          <div>
            <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Previsões
            </h4>
            <ul className="space-y-2">
              {insights.predictions?.map((pred: any, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-500 mt-1 font-bold">•</span>
                  <span className="flex-1">{improveInsightText(pred)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Anomalies */}
        {hasAnomalies && (
          <div>
            <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              Anomalias Detectadas
            </h4>
            <ul className="space-y-2">
              {insights.anomalies?.map((anomaly: any, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-orange-500 mt-1 font-bold">•</span>
                  <span className="flex-1">{improveInsightText(anomaly)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-muted-foreground text-right flex items-center justify-end gap-2">
            <span className="opacity-70">Gerado em:</span>
            <span className="font-medium">{formatDateTime(insights.generatedAt)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
