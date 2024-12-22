import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

const metrics = [
  {
    title: "熟料产量",
    value: "8,915 吨",
    change: "+1,234 吨 预计",
    percentage: "5.2%",
    trend: "up",
  },
  {
    title: "能源消耗",
    value: "3,450 kWh/t",
    change: "-120 kWh/t 预计",
    percentage: "3.4%",
    trend: "down",
  },
  {
    title: "质量合格率",
    value: "98.7%",
    change: "+0.5% 预计",
    percentage: "0.5%",
    trend: "up",
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.change}</p>
            <div className="flex items-center space-x-2 mt-4">
              {metric.trend === "up" ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }
              >
                {metric.percentage}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
