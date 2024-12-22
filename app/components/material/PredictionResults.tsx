"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Switch } from "@/ui/switch";
import { Label } from "@/ui/label";

interface PredictionResultsProps {
  results: {
    strength: {
      "1d": { value: number; confidence: number };
      "3d": { value: number; confidence: number };
      "28d": { value: number; confidence: number };
    };
    chemical: Record<string, number>;
  };
}

export function PredictionResults({ results }: PredictionResultsProps) {
  const [useLogScale, setUseLogScale] = useState(false);

  const prepareChartData = (chemical: Record<string, number>) => {
    return Object.entries(chemical).map(([name, value]) => ({
      name,
      value: useLogScale ? Math.log10(value + 0.01) : value, // 添加0.01以避免log(0)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>强度预测结果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(results.strength).map(
              ([day, { value, confidence }]) => (
                <div
                  key={day}
                  className="text-center p-4 bg-gray-700 rounded-lg"
                >
                  <div className="text-2xl font-bold text-white">
                    {value.toFixed(2)} MPa
                  </div>
                  <div className="text-sm text-gray-300">
                    {day === "1d" ? "1天" : day === "3d" ? "3天" : "28天"}强度
                  </div>
                  <div className="text-xs text-gray-400">
                    ±{confidence.toFixed(2)} MPa
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>化学成分分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end items-center space-x-2 mb-4">
            <Switch
              id="log-scale"
              checked={useLogScale}
              onCheckedChange={setUseLogScale}
            />
            <Label htmlFor="log-scale">使用对数刻度</Label>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={prepareChartData(results.chemical)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={useLogScale ? [-2, 2] : [0, "dataMax"]}
                    tickFormatter={(value) =>
                      useLogScale ? `10^${value.toFixed(0)}` : value.toFixed(1)
                    }
                  />
                  <YAxis dataKey="name" type="category" width={60} />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const originalValue =
                        results.chemical[props.payload.name];
                      return [
                        `${originalValue.toFixed(3)}%`,
                        props.payload.name,
                      ];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>成分</TableHead>
                    <TableHead className="text-right">含量 (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(results.chemical).map(([name, value]) => (
                    <TableRow key={name}>
                      <TableCell>{name}</TableCell>
                      <TableCell className="text-right">
                        {value.toFixed(3)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
