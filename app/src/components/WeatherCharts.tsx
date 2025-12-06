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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  time: string;
  temperatura: number;
  umidade: number;
  vento: number;
  chuva: number;
}

interface WeatherChartsProps {
  chartData: ChartDataPoint[] | undefined;
}

export function WeatherCharts({ chartData }: WeatherChartsProps) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    // Observer para detectar mudanças na classe 'dark' do html
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

  // Cores adaptativas com melhor contraste
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#e5e7eb" : "#6b7280";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const textColor = isDark ? "#f9fafb" : "#1f2937";

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Temperatura ao Longo do Tempo</CardTitle>
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
              <Legend wrapperStyle={{ color: textColor }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="temperatura"
                stroke="#ef4444"
                name="Temperatura (°C)"
                strokeWidth={2}
                dot={{ fill: "#ef4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Probabilidade de Chuva e Umidade</CardTitle>
          <CardDescription>
            Últimos {chartData.length} registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="time"
                stroke={axisColor}
                tick={{ fill: isDark ? "#f9fafb" : "#1f2937", fontSize: 12 }}
              />
              <YAxis
                stroke={axisColor}
                tick={{ fill: isDark ? "#f9fafb" : "#1f2937", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  color: isDark ? "#f9fafb" : "#1f2937",
                }}
                labelStyle={{ color: isDark ? "#f9fafb" : "#1f2937" }}
                itemStyle={{ color: isDark ? "#f9fafb" : "#1f2937" }}
              />
              <Legend wrapperStyle={{ color: textColor }} iconType="circle" />
              <Bar dataKey="chuva" fill="#3b82f6" name="Chuva (%)" />
              <Bar dataKey="umidade" fill="#10b981" name="Umidade (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
