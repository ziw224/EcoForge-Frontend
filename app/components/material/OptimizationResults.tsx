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

type ComparisonGroup =
  | "ratios"
  | "strength"
  | "majorChemical"
  | "minorChemical";

const GROUPS: Record<ComparisonGroup, (keyof OptimizationResult)[]> = {
  ratios: ["KH", "N", "P"],
  strength: [],
  majorChemical: [],
  minorChemical: [],
};

interface OptimizationResultsProps {
  results: OptimizationResult[];
}

export function OptimizationResults({ results }: OptimizationResultsProps) {
  const [selectedResult, setSelectedResult] = useState(results[0]);
  const [previousResult, setPreviousResult] =
    useState<OptimizationResult | null>(null);
  const [useLogScale, setUseLogScale] = useState(false);
  const [comparisonGroup, setComparisonGroup] =
    useState<ComparisonGroup>("ratios");
  const [amplifyDifferences, setAmplifyDifferences] = useState(false);

  const handleTabChange = (value: string) => {
    const newResult =
      results.find((r) => r.id.toString() === value) || results[0];
    setPreviousResult(selectedResult);
    setSelectedResult(newResult);
  };

  const isValidKey = (key: string): key is keyof OptimizationResult =>
    key in selectedResult;

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

  const prepareStrengthData = (strength: OptimizationResult["strength"]) => {
    return [
      { name: "1天", 强度: strength["1d"] },
      { name: "3天", 强度: strength["3d"] },
      { name: "28天", 强度: strength["28d"] },
    ];
  };

  const prepareComparisonData = () => {
    const keys = GROUPS[comparisonGroup];
    return keys.map((key) => {
      const values = results.map((result) => result[key] || 0);
      return {
        name: key as string,
        方案1: values[0],
        方案2: values[1],
        方案3: values[2],
      };
    });
  };

  const handleComparisonGroupChange = (value: string) => {
    if (value in GROUPS) {
      setComparisonGroup(value as ComparisonGroup);
    }
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
                  {GROUPS[comparisonGroup].map(
                    (key) =>
                      isValidKey(key) && (
                        <div
                          key={key}
                          className="text-center p-4 bg-gray-700 rounded-lg"
                        >
                          <div className="text-2xl font-bold text-white">
                            {typeof result[key] === "number"
                              ? result[key].toFixed(2)
                              : "N/A"}
                            {typeof result[key] === "number" &&
                              compareValues(
                                result[key],
                                previousResult?.[key] as number
                              )}
                          </div>
                          <div className="text-sm text-gray-300">{key}值</div>
                        </div>
                      )
                  )}
                </div>
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
                onValueChange={handleComparisonGroupChange}
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
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={prepareComparisonData()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={60} />
              <Tooltip />
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
        </CardContent>
      </Card>
    </div>
  );
}
