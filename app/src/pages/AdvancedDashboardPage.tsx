import { useDashboard } from "@/hooks/useDashboard";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { WeatherCards } from "@/components/WeatherCards";
import { InsightsCard } from "@/components/InsightsCard";
import { DashboardFiltersComponent } from "@/components/DashboardFilters";
import { AdvancedCharts } from "@/components/AdvancedCharts";
import { StatisticsCard } from "@/components/StatisticsCard";
import { ComfortIndexCard } from "@/components/ComfortIndexCard";
import { Button } from "@/components/ui/button";
import { LayoutGrid, BarChart3, RefreshCw, Download } from "lucide-react";
import { useState } from "react";

export function AdvancedDashboardPage() {
  const {
    dashboard,
    insights,
    isLoading,
    isRefreshing,
    isExporting,
    isLoadingInsights,
    loadDashboard,
    regenerateInsights,
    handleExportCSV,
    handleExportXLSX,
    chartData,
    currentLog,
    location,
    chartConfigs,
  } = useDashboard();

  const {
    filters,
    dateRange,
    filteredData,
    handleDateRangeChange,
    handleCustomDateSelect,
    handleMetricToggle,
    handleTimeOfDayChange,
    handleWeatherConditionChange,
    resetFilters,
  } = useDashboardFilters(chartData);

  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Avançado</h1>
          <p className="text-muted-foreground">
            Análise completa com filtros - {location}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === "compact" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("compact")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compacto
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboard}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportXLSX}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            XLSX
          </Button>
        </div>
      </div>

      {/* Layout Grid vs Compact */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar com Filtros */}
          <div className="lg:col-span-1 space-y-6">
            <DashboardFiltersComponent
              filters={filters}
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              onCustomDateSelect={handleCustomDateSelect}
              onMetricToggle={handleMetricToggle}
              onTimeOfDayChange={handleTimeOfDayChange}
              onWeatherConditionChange={handleWeatherConditionChange}
              onReset={resetFilters}
            />

            <div className="space-y-4">
              <ComfortIndexCard comfort={dashboard?.comfort} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <WeatherCards currentLog={currentLog} />

            <InsightsCard
              insights={insights}
              isLoading={isLoadingInsights}
              onRegenerate={regenerateInsights}
            />

            <AdvancedCharts chartData={filteredData} config={chartConfigs} />

            <StatisticsCard statistics={dashboard?.statistics} />
          </div>
        </div>
      ) : (
        // Compact View
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-2">
              <DashboardFiltersComponent
                filters={filters}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                onCustomDateSelect={handleCustomDateSelect}
                onMetricToggle={handleMetricToggle}
                onTimeOfDayChange={handleTimeOfDayChange}
                onWeatherConditionChange={handleWeatherConditionChange}
                onReset={resetFilters}
              />
            </div>
            <ComfortIndexCard comfort={dashboard?.comfort} />
          </div>

          <WeatherCards currentLog={currentLog} />

          <div className="grid gap-6 lg:grid-cols-2">
            <InsightsCard
              insights={insights}
              isLoading={isLoadingInsights}
              onRegenerate={regenerateInsights}
            />
            <StatisticsCard statistics={dashboard?.statistics} />
          </div>

          <AdvancedCharts chartData={filteredData} config={chartConfigs} />
        </div>
      )}

      {/* Data Summary */}
      <div className="bg-muted/50 rounded-lg p-4 border-2 border-primary/20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="font-semibold text-foreground">
              Resumo dos Filtros
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">
                Total Original
              </p>
              <p className="text-2xl font-bold text-foreground">
                {chartData?.length || 0}
              </p>
            </div>

            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Após Filtros</p>
              <p className="text-2xl font-bold text-primary">
                {filteredData.length}
              </p>
            </div>

            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Filtrados</p>
              <p className="text-2xl font-bold text-destructive">
                {(chartData?.length || 0) - filteredData.length}
              </p>
            </div>

            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Período</p>
              <p className="text-sm font-bold text-foreground">
                {filters.dateRange.type === "last7days"
                  ? "7 dias"
                  : filters.dateRange.type === "last30days"
                  ? "30 dias"
                  : "Custom"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Filtros ativos:
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
              📅 {filters.dateRange.type === "last7days" ? "7 dias" : "30 dias"}
            </span>
            {filters.timeOfDay !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                🕐{" "}
                {filters.timeOfDay === "morning"
                  ? "Manhã"
                  : filters.timeOfDay === "afternoon"
                  ? "Tarde"
                  : filters.timeOfDay === "evening"
                  ? "Noite"
                  : "Madrugada"}
              </span>
            )}
            {filters.weatherCondition !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                ☁️{" "}
                {filters.weatherCondition === "clear"
                  ? "Limpo"
                  : filters.weatherCondition === "cloudy"
                  ? "Nublado"
                  : "Chuvoso"}
              </span>
            )}
            {(chartData?.length || 0) > filteredData.length && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                🗑️ {(chartData?.length || 0) - filteredData.length} removidos
              </span>
            )}
          </div>

          {/* Barra de progresso */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Dados exibidos</span>
              <span>
                {chartData?.length
                  ? Math.round((filteredData.length / chartData.length) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${
                    chartData?.length
                      ? (filteredData.length / chartData.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
