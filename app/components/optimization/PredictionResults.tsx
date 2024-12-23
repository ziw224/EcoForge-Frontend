"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = {
  major: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"],
  minor: ["#82ca9d", "#ffc658"],
  alkali: ["#8884d8", "#83a6ed", "#8dd1e1"],
};

interface PredictionResultsProps {
  results: {
    strength: Record<string, number>;
    chemical: {
      major: Record<string, number>;
      minor: Record<string, number>;
      alkali: Record<string, number>;
      other: Record<string, number>;
    };
  };
}

export function PredictionResults({ results }: PredictionResultsProps) {
  const strengthData = [
    { name: "1天", 强度: results.strength["1d"] },
    { name: "3天", 强度: results.strength["3d"] },
    { name: "28天", 强度: results.strength["28d"] },
  ];

  const preparePieData = (data: Record<string, number>) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value: Number(value),
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
            {Object.entries(results.strength).map(([day, value]) => (
              <div key={day} className="text-center">
                <div className="text-2xl font-bold">{value as number} MPa</div>
                <div className="text-sm text-gray-600">{day}强度</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={strengthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="强度" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>化学成分分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={preparePieData(results.chemical.major)}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {preparePieData(results.chemical.major).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS.major[index % COLORS.major.length]}
                        />
                      )
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>成分</TableHead>
                    <TableHead>含量 (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(results.chemical.major).map(
                    ([name, value]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{(value as number).toFixed(2)}%</TableCell>
                      </TableRow>
                    )
                  )}
                  {Object.entries(results.chemical.minor).map(
                    ([name, value]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{(value as number).toFixed(2)}%</TableCell>
                      </TableRow>
                    )
                  )}
                  {Object.entries(results.chemical.alkali).map(
                    ([name, value]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{(value as number).toFixed(2)}%</TableCell>
                      </TableRow>
                    )
                  )}
                  {Object.entries(results.chemical.other).map(
                    ([name, value]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{(value as number).toFixed(2)}%</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
