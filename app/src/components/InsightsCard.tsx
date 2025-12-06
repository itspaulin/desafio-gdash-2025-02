import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function InsightsCard({
  insights,
  isLoading,
  onRegenerate,
}: InsightsCardProps) {
  if (!insights) return null;

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

  const hasTrends =
    insights.trends &&
    Array.isArray(insights.trends) &&
    insights.trends.length > 0 &&
    typeof insights.trends[0] === "object" &&
    insights.trends[0].metric;

  const hasAlerts =
    insights.alerts &&
    Array.isArray(insights.alerts) &&
    insights.alerts.length > 0;

  const hasRecommendations =
    insights.recommendations &&
    Array.isArray(insights.recommendations) &&
    insights.recommendations.length > 0;

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
            className="border-blue-200 dark:border-blue-800"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Regenerar
          </Button>
        </div>
        <CardDescription className="dark:text-blue-100">
          {insights.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trends */}
        {hasTrends && (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-foreground">
              Tendências
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {insights.trends.map((trend: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="mt-0.5 text-gray-600 dark:text-gray-400">
                    {getTrendIcon(trend.direction)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize text-foreground">
                      {trend.metric.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trend.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {hasAlerts && (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-foreground">
              Alertas
            </h4>
            <div className="space-y-2">
              {insights.alerts.map((alert: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
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
                    <p className="text-sm font-medium text-foreground">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
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
            <h4 className="font-semibold mb-2 text-sm text-foreground">
              Recomendações
            </h4>
            <ul className="space-y-1">
              {insights.recommendations.map((rec: any, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-right">
          Gerado em: {new Date(insights.generatedAt).toLocaleString("pt-BR")}
        </p>
      </CardContent>
    </Card>
  );
}
