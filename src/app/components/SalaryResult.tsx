import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Lightbulb, ArrowLeft } from "lucide-react";
import type { ResumeData } from "./ResumeForm";

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface SalaryResultProps {
  resumeData: ResumeData;
  salaryRange: SalaryRange;
  recommendations: Recommendation[];
  onRecalculate: () => void;
}

export function SalaryResult({
  resumeData,
  salaryRange,
  recommendations,
  onRecalculate,
}: SalaryResultProps) {
  const chartData = [
    {
      name: "Минимум",
      value: salaryRange.min,
      color: "#93c5fd",
    },
    {
      name: "Медиана",
      value: salaryRange.median,
      color: "#3b82f6",
    },
    {
      name: "Максимум",
      value: salaryRange.max,
      color: "#1d4ed8",
    },
  ];

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat("ru-RU").format(value);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "success";
      case "medium":
        return "warning";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high":
        return "Высокий эффект";
      case "medium":
        return "Средний эффект";
      case "low":
        return "Низкий эффект";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Button variant="ghost" onClick={onRecalculate} className="mb-4">
        <ArrowLeft className="size-4" />
        Назад к форме
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-6 text-blue-600" />
            Ваша вилка дохода
          </CardTitle>
          <CardDescription>
            {resumeData.position} • {resumeData.city} • {resumeData.experience} лет опыта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Минимум</div>
                <div className="text-2xl font-semibold text-blue-600">
                  {formatSalary(salaryRange.min)} ₽
                </div>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Медиана</div>
                <div className="text-2xl font-semibold text-blue-700">
                  {formatSalary(salaryRange.median)} ₽
                </div>
              </div>
              <div className="text-center p-4 bg-blue-600 rounded-lg">
                <div className="text-sm text-white mb-1">Максимум</div>
                <div className="text-2xl font-semibold text-white">
                  {formatSalary(salaryRange.max)} ₽
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value: number) => `${formatSalary(value)} ₽`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-6 text-yellow-500" />
            Рекомендации для улучшения
          </CardTitle>
          <CardDescription>
            Следуйте этим советам, чтобы увеличить свою рыночную стоимость
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-medium">{recommendation.title}</h4>
                  <Badge variant={getImpactColor(recommendation.impact)}>
                    {getImpactLabel(recommendation.impact)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{recommendation.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onRecalculate} size="lg" variant="outline">
          Пересчитать с учетом рекомендаций
        </Button>
      </div>
    </div>
  );
}
