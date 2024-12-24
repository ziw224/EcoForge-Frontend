"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Radar } from "recharts";
import { OptimizationResult } from "@/types/common";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

interface OptimizationResultsProps {
  results: OptimizationResult[];
}

type ComparisonRow = {
  name: string;
  原始值1: number;
  原始值2: number;
  原始值3: number;
};

export function OptimizationResults({ results }: OptimizationResultsProps) {
  const [selectedResult, setSelectedResult] = useState(results[0]);
  const [previousResult, setPreviousResult] =
    useState<OptimizationResult | null>(null);
  const [useLogScale, setUseLogScale] = useState(false);
  const groups = {
    ratios: ["KH", "N", "P"],
    strength: ["1d", "3d", "28d"],
    majorChemical: ["SiO₂", "Al₂O₃", "Fe₂O₃", "CaO", "MgO"],
    minorChemical: ["SO₃", "f-CaO", "Na₂O", "K₂O", "Cl⁻"],
  };

  const [comparisonGroup, setComparisonGroup] =
    useState<keyof typeof groups>("ratios");
  const [amplifyDifferences, setAmplifyDifferences] = useState(false);

  const handleTabChange = (value: string) => {
    const newResult =
      results.find((r) => r.id.toString() === value) || results[0];
    setPreviousResult(selectedResult);
    setSelectedResult(newResult);
  };

  const compareValues = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (diff > 0)
      return <ArrowUpIcon className="inline text-green-400 w-4 h-4 ml-1" />;
    if (diff < 0)
      return <ArrowDownIcon className="inline text-red-400 w-4 h-4 ml-1" />;
    return <MinusIcon className="inline text-gray-400 w-4 h-4 ml-1" />;
  };

  const chemicalDifference = useMemo(() => {
    if (!previousResult) return {};
    const diff: Record<string, number> = {};
    Object.keys(selectedResult.chemical).forEach((key) => {
      diff[key] =
        selectedResult.chemical[key] - (previousResult.chemical[key] || 0);
    });
    return diff;
  }, [selectedResult, previousResult]);

  const prepareChartData = (chemical: Record<string, number>) => {
    return Object.entries(chemical).map(([name, value]) => ({
      name,
      value: useLogScale ? Math.log10(value + 0.01) : value, // 添加0.01以避免log(0)
    }));
  };

  const prepareStrengthData = (strength: {
    "1d": number;
    "3d": number;
    "28d": number;
  }) => {
    return [
      { name: "1天", 强度: strength["1d"] },
      { name: "3天", 强度: strength["3d"] },
      { name: "28天", 强度: strength["28d"] },
    ];
  };

  const normalizeData = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return data.map((value) => (value - min) / (max - min));
  };

  const prepareComparisonData = (): ComparisonRow[] => {
    const groups = {
      ratios: ["KH", "N", "P"],
      strength: ["1d", "3d", "28d"],
      majorChemical: ["SiO₂", "Al₂O₃", "Fe₂O₃", "CaO", "MgO"],
      minorChemical: ["SO₃", "f-CaO", "Na₂O", "K₂O", "Cl⁻"],
    };

    const data = groups[comparisonGroup as keyof typeof groups].map((key) => {
      const values = results.map((result) => {
        if (["KH", "N", "P"].includes(key)) {
          // Handle KH, N, P directly
          return result[key as "KH" | "N" | "P"];
        } else if (["1d", "3d", "28d"].includes(key)) {
          // Handle strength keys
          return result.strength[key as keyof OptimizationResult["strength"]];
        } else {
          // Handle chemical composition keys
          return result.chemical[key] || 0;
        }
      });

      const normalizedValues = amplifyDifferences
        ? normalizeData(values)
        : values;

      return {
        name: key,
        方案1: normalizedValues[0],
        方案2: normalizedValues[1],
        方案3: normalizedValues[2],
        原始值1: values[0],
        原始值2: values[1],
        原始值3: values[2],
      };
    });

    return data;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>熟料率值优化结果</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={selectedResult.id.toString()}
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-3">
              {results.map((result) => (
                <TabsTrigger key={result.id} value={result.id.toString()}>
                  方案 {result.id}
                </TabsTrigger>
              ))}
            </TabsList>
            {results.map((result) => (
              <TabsContent key={result.id} value={result.id.toString()}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {["KH", "N", "P"].map((key) => (
                    <div
                      key={key}
                      className="text-center p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-white">
                        {result[key as "KH" | "N" | "P"].toFixed(2)}
                        {compareValues(
                          result[key as "KH" | "N" | "P"],
                          previousResult?.[key as "KH" | "N" | "P"]
                        )}
                      </div>
                      <div className="text-sm text-gray-300">{key}值</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {["1d", "3d", "28d"].map((day) => (
                    <div
                      key={day}
                      className="text-center p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-white">
                        {result.strength[day as "1d" | "3d" | "28d"].toFixed(1)}{" "}
                        MPa
                        {compareValues(
                          result.strength[day as "1d" | "3d" | "28d"],
                          previousResult?.strength[day as "1d" | "3d" | "28d"]
                        )}
                      </div>
                      <div className="text-sm text-gray-300">
                        {day.replace("d", "天")}强度
                      </div>
                    </div>
                  ))}
                </div>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>方案 {result.id} 强度变化</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={prepareStrengthData(result.strength)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="强度"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>方案 {result.id} 化学成分分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-gray-600">
                      该方案的主要特点是 {result.KH > 0.92 ? "较高" : "较低"} 的
                      KH 值（{result.KH.toFixed(2)}），
                      {result.N > 2.35 ? "较高" : "较低"} 的硅率（
                      {result.N.toFixed(2)}）， 以及{" "}
                      {result.P > 1.45 ? "较高" : "较低"} 的铝率（
                      {result.P.toFixed(2)}）。 这可能导致{" "}
                      {result.strength["28d"] > 58 ? "较高" : "较低"}{" "}
                      的28天强度（{result.strength["28d"].toFixed(1)} MPa）。
                    </p>
                    <div className="flex justify-end items-center space-x-2 mb-4">
                      <Switch
                        id={`log-scale-${result.id}`}
                        checked={useLogScale}
                        onCheckedChange={setUseLogScale}
                      />
                      <Label htmlFor={`log-scale-${result.id}`}>
                        使用对数刻度
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart
                            data={prepareChartData(result.chemical)}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              type="number"
                              domain={useLogScale ? [-2, 2] : [0, "dataMax"]}
                              tickFormatter={(value) =>
                                useLogScale
                                  ? `10^${value.toFixed(0)}`
                                  : value.toFixed(1)
                              }
                            />
                            <YAxis dataKey="name" type="category" width={60} />
                            <Tooltip
                              formatter={(value, name, props) => {
                                const originalValue =
                                  result.chemical[props.payload.name];
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
                              <TableHead className="text-right">
                                含量 (%)
                              </TableHead>
                              <TableHead className="text-right">变化</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(result.chemical).map(
                              ([name, value]) => (
                                <TableRow key={name}>
                                  <TableCell>{name}</TableCell>
                                  <TableCell className="text-right">
                                    {value.toFixed(3)}%
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {chemicalDifference[name] ? (
                                      <span
                                        className={
                                          chemicalDifference[name] > 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }
                                      >
                                        {chemicalDifference[name] > 0
                                          ? "+"
                                          : ""}
                                        {chemicalDifference[name].toFixed(3)}%
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>方案比较</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="comparison-group">比较指标组</Label>
              <Select
                value={comparisonGroup}
                onValueChange={(value) =>
                  setComparisonGroup(
                    value as
                      | "ratios"
                      | "strength"
                      | "majorChemical"
                      | "minorChemical"
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择比较指标组" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ratios">熟料率值</SelectItem>
                  <SelectItem value="strength">强度</SelectItem>
                  <SelectItem value="majorChemical">主要化学成分</SelectItem>
                  <SelectItem value="minorChemical">次要化学成分</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="amplify-differences"
                checked={amplifyDifferences}
                onCheckedChange={setAmplifyDifferences}
              />
              <Label htmlFor="amplify-differences">放大差异</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={prepareComparisonData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={60} />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const originalValue =
                        props.payload[`原始值${String(name).slice(-1)}`];
                      return [`${originalValue.toFixed(3)}`, name];
                    }}
                  />
                  <Legend />
                  {results.map((_, index) => (
                    <Bar
                      key={index}
                      dataKey={`方案${index + 1}`}
                      fill={COLORS[index]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指标</TableHead>
                    <TableHead>方案1</TableHead>
                    <TableHead>方案2</TableHead>
                    <TableHead>方案3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prepareComparisonData().map((row) => (
                    <TableRow key={row.name}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row["原始值1"].toFixed(3)}</TableCell>
                      <TableCell>{row["原始值2"].toFixed(3)}</TableCell>
                      <TableCell>{row["原始值3"].toFixed(3)}</TableCell>
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
