import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Filter, X, Save, Cloud } from "lucide-react";
import {
  DashboardFilters,
  MetricFilter,
  TimeOfDayFilter,
  WeatherConditionFilter,
  SavedFilter,
} from "@/types/filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

interface DashboardFiltersProps {
  filters: DashboardFilters;
  dateRange?: DateRange;
  onDateRangeChange: (value: string) => void;
  onCustomDateSelect: (range: DateRange | undefined) => void;
  onMetricToggle: (metric: MetricFilter) => void;
  onTimeOfDayChange: (value: TimeOfDayFilter) => void;
  onWeatherConditionChange: (value: WeatherConditionFilter) => void;
  onReset: () => void;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string) => void;
  onLoadFilter?: (filter: SavedFilter) => void;
  onDeleteFilter?: (id: string) => void;
}

export function DashboardFiltersComponent({
  filters,
  dateRange,
  onDateRangeChange,
  onCustomDateSelect,
  onTimeOfDayChange,
  onWeatherConditionChange,
  onReset,
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
}: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");

  const handleSaveFilter = () => {
    if (filterName.trim() && onSaveFilter) {
      onSaveFilter(filterName);
      setFilterName("");
      setShowSaveDialog(false);
    }
  };

  const timeLabels: Record<TimeOfDayFilter, string> = {
    all: "Todos os horários",
    morning: "Manhã (6h-12h)",
    afternoon: "Tarde (12h-18h)",
    evening: "Noite (18h-00h)",
    night: "Madrugada (0h-6h)",
  };

  const weatherLabels: Record<WeatherConditionFilter, string> = {
    all: "Todas as condições",
    clear: "Limpo",
    cloudy: "Nublado",
    rainy: "Chuvoso",
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Filtros</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? "Ocultar" : "Mostrar"}
            </Button>
            {onSaveFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(!showSaveDialog)}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`space-y-6 ${!isExpanded && "hidden lg:block"}`}>
        {/* Save Filter Dialog */}
        {showSaveDialog && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <Label>Nome do filtro</Label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Ex: Manhãs de verão"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveFilter}>
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div className="space-y-2">
            <Label>Filtros Salvos</Label>
            <div className="space-y-2">
              {savedFilters.map((saved) => (
                <div
                  key={saved.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span
                    className="text-sm cursor-pointer hover:text-primary"
                    onClick={() => onLoadFilter?.(saved)}
                  >
                    {saved.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteFilter?.(saved.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <CalendarIcon className="h-4 w-4" />
            Período
          </Label>
          <Select
            value={filters.dateRange.type}
            onValueChange={onDateRangeChange}
          >
            <SelectTrigger className="bg-card border-input text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="last7days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30days">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Date Picker */}
          {filters.dateRange.type === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, "dd/MM/yyyy", {
                        locale: ptBR,
                      })} - ${format(dateRange.to, "dd/MM/yyyy", {
                        locale: ptBR,
                      })}`
                    : "Selecione as datas"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={onCustomDateSelect}
                  locale={ptBR}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Time of Day Filter */}
        <div className="space-y-2">
          <Label className="text-foreground">Período do Dia</Label>
          <Select value={filters.timeOfDay} onValueChange={onTimeOfDayChange}>
            <SelectTrigger className="bg-card border-input text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {(Object.keys(timeLabels) as TimeOfDayFilter[]).map((time) => (
                <SelectItem key={time} value={time}>
                  {timeLabels[time]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weather Condition Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Cloud className="h-4 w-4" />
            Condição Climática
          </Label>
          <Select
            value={filters.weatherCondition}
            onValueChange={onWeatherConditionChange}
          >
            <SelectTrigger className="bg-card border-input text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {(Object.keys(weatherLabels) as WeatherConditionFilter[]).map(
                (weather) => (
                  <SelectItem key={weather} value={weather}>
                    {weatherLabels[weather]}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Filtros ativos:</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
              📅{" "}
              {filters.dateRange.type === "last7days"
                ? "7 dias"
                : filters.dateRange.type === "last30days"
                ? "30 dias"
                : "Personalizado"}
            </span>
            {filters.timeOfDay !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                🕐 {timeLabels[filters.timeOfDay]}
              </span>
            )}
            {filters.weatherCondition !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                ☁️ {weatherLabels[filters.weatherCondition]}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
