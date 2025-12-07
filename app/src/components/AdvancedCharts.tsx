import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartConfig } from "@/types/filters";
import { WeatherLog } from "@/types/weather";

interface ChartDataPoint {
  time: string;
  temperatura: number;
  umidade: number;
  vento: number;
  chuva: number;
  condition?: string;
  collectedAt?: string;
  rawDate?: Date;
  weatherLog?: WeatherLog;
}

interface AdvancedChartsProps {
  chartData: ChartDataPoint[] | undefined;
  config: ChartConfig[];
}

export function AdvancedCharts({ chartData, config }: AdvancedChartsProps) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!chartData || chartData.length === 0) return null;

  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#e5e7eb" : "#6b7280";
  const textColor = isDark ? "#f9fafb" : "#1f2937";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  const colors = {
    temperatura: "#ef4444",
    umidade: "#10b981",
    vento: "#3b82f6",
    chuva: "#8b5cf6",
  };

  const metricMap = {
    temperature: "temperatura",
    humidity: "umidade",
    windSpeed: "vento",
    rainProbability: "chuva",
  };

  const COLORS = ["#ef4444", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

  const pieData =
    chartData.length > 0
      ? [
          {
            name: "Temperatura",
            value:
              chartData.reduce((acc, d) => acc + d.temperatura, 0) /
              chartData.length,
          },
          {
            name: "Umidade",
            value:
              chartData.reduce((acc, d) => acc + d.umidade, 0) /
              chartData.length,
          },
          {
            name: "Vento",
            value:
              chartData.reduce((acc, d) => acc + d.vento, 0) / chartData.length,
          },
          {
            name: "Chuva",
            value:
              chartData.reduce((acc, d) => acc + d.chuva, 0) / chartData.length,
          },
        ]
      : [];

  const radarData = chartData.slice(-5).map((d) => ({
    time: d.time,
    Temperatura: d.temperatura,
    Umidade: d.umidade,
    Vento: d.vento,
    Chuva: d.chuva,
  }));

  const renderChart = (chartConfig: ChartConfig, index: number) => {
    const { type, metrics, title } = chartConfig;

    switch (type) {
      case "line":
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                Últimos {chartData.length} registros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="time"
                    stroke={axisColor}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: textColor,
                    }}
                    labelStyle={{ color: textColor }}
                    itemStyle={{ color: textColor }}
                  />
                  <Legend wrapperStyle={{ color: textColor }} />
                  {metrics.map((metric) => {
                    const dataKey = metricMap[metric];
                    return (
                      <Line
                        key={metric}
                        type="monotone"
                        dataKey={dataKey}
                        stroke={colors[dataKey as keyof typeof colors]}
                        strokeWidth={2}
                        dot={{ fill: colors[dataKey as keyof typeof colors] }}
                        name={
                          metric === "temperature"
                            ? "Temperatura (°C)"
                            : metric === "humidity"
                            ? "Umidade (%)"
                            : metric === "windSpeed"
                            ? "Vento (km/h)"
                            : "Chuva (%)"
                        }
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "area":
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Área de variação</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="time"
                    stroke={axisColor}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: textColor,
                    }}
                    labelStyle={{ color: textColor }}
                    itemStyle={{ color: textColor }}
                  />
                  <Legend wrapperStyle={{ color: textColor }} />
                  {metrics.map((metric) => {
                    const dataKey = metricMap[metric];
                    return (
                      <Area
                        key={metric}
                        type="monotone"
                        dataKey={dataKey}
                        stroke={colors[dataKey as keyof typeof colors]}
                        fill={colors[dataKey as keyof typeof colors]}
                        fillOpacity={0.6}
                        name={
                          metric === "temperature"
                            ? "Temperatura (°C)"
                            : metric === "humidity"
                            ? "Umidade (%)"
                            : metric === "windSpeed"
                            ? "Vento (km/h)"
                            : "Chuva (%)"
                        }
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "bar":
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Comparação de métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="time"
                    stroke={axisColor}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: textColor,
                    }}
                    labelStyle={{ color: textColor }}
                    itemStyle={{ color: textColor }}
                  />
                  <Legend wrapperStyle={{ color: textColor }} />
                  {metrics.map((metric) => {
                    const dataKey = metricMap[metric];
                    return (
                      <Bar
                        key={metric}
                        dataKey={dataKey}
                        fill={colors[dataKey as keyof typeof colors]}
                        name={
                          metric === "temperature"
                            ? "Temperatura (°C)"
                            : metric === "humidity"
                            ? "Umidade (%)"
                            : metric === "windSpeed"
                            ? "Vento (km/h)"
                            : "Chuva (%)"
                        }
                      />
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "pie":
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Distribuição média das métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: textColor,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "radar":
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Comparação multivariável</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis
                    dataKey="time"
                    tick={{ fill: textColor, fontSize: 10 }}
                  />
                  <PolarRadiusAxis tick={{ fill: textColor, fontSize: 10 }} />
                  <Radar
                    name="Temperatura"
                    dataKey="Temperatura"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Umidade"
                    dataKey="Umidade"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Vento"
                    dataKey="Vento"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Chuva"
                    dataKey="Chuva"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Legend wrapperStyle={{ color: textColor }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: textColor,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {config.map((chartConfig, index) => renderChart(chartConfig, index))}
    </div>
  );
}
