"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const modelVersions = [
  { id: "v1.0", name: "Version 1.0 - 基础版" },
  { id: "v1.1", name: "Version 1.1 - 优化版" },
  { id: "v2.0", name: "Version 2.0 - 高级版" },
];

const defaultStoragePath = "/data/predictions/cement-strength/";

const coalParameters = [
  { id: "Wf", name: "内水", unit: "Wf" },
  { id: "Minh", name: "外水", unit: "Minh" },
  { id: "Aad", name: "灰分", unit: "Aad" },
  { id: "FC", name: "固定碳", unit: "FC" },
  { id: "S", name: "硫含量", unit: "S" },
  { id: "GAR", name: "煤粉细度", unit: "GAR" },
  { id: "JG", name: "热值", unit: "J/G" },
  { id: "Qgr", name: "热功率", unit: "Qgr" },
];
const clinkerParameters = [
  { id: "LOSS", name: "烧失量", unit: "LOSS", visible: true },
  { id: "SiO2", name: "二氧化硅", unit: "SiO2", visible: true },
  { id: "Al2O3", name: "三氧化二铝", unit: "Al2O3", visible: true },
  { id: "Fe2O3", name: "三氧化二铁", unit: "Fe2O3", visible: true },
  { id: "CaO", name: "氧化钙", unit: "CaO", visible: true },
  { id: "MgO", name: "氧化镁", unit: "MgO", visible: true },
  { id: "SO3", name: "三氧化硫", unit: "SO3", visible: true },
  { id: "Na2O", name: "氧化钠", unit: "Na2O", visible: true },
  { id: "K2O", name: "氧化钾", unit: "K2O", visible: true },
  { id: "R2O", name: "碱含量", unit: "R2O", visible: true },
  { id: "CL", name: "氯离子", unit: "CL", visible: true },
];

const chemicalParameters = [
  { id: "l-LOSS", name: "烧失量", unit: "l-LOSS" },
  { id: "l-SiO2", name: "二氧化硅", unit: "l-SiO2" },
  { id: "l-Al2O3", name: "三氧化二铝", unit: "l-Al2O3" },
  { id: "l-Fe2O3", name: "三氧化二铁", unit: "l-Fe2O3" },
  { id: "l-CaO", name: "氧化钙", unit: "l-CaO" },
  { id: "l-MgO", name: "氧化镁", unit: "l-MgO" },
  { id: "l-SO3", name: "三氧化硫", unit: "l-SO3" },
  { id: "l-Na2O", name: "氧化钠", unit: "l-Na2O" },
  { id: "l-K2O", name: "氧化钾", unit: "l-K2O" },
  { id: "l-R2O", name: "碱含量", unit: "l-R2O" },
  { id: "l-CL", name: "氯离子", unit: "l-CL" },
];

type ParameterCategory = "basic" | "coal" | "clinker" | "chemical";

export function ParameterInput() {
  const [parameters, setParameters] = useState<{
    basic: {
      date: string;
      batchNumber: string;
      operator: string;
      modelVersion: string;
      storagePath: string;
    };
    coal: Record<string, string>;
    clinker: Record<string, string>;
    chemical: Record<string, string>;
  }>({
    basic: {
      date: new Date().toISOString().split("T")[0],
      batchNumber: "",
      operator: "",
      modelVersion: "v2.0",
      storagePath: defaultStoragePath,
    },
    coal: Object.fromEntries(coalParameters.map((p) => [p.id, ""])),
    clinker: Object.fromEntries(clinkerParameters.map((p) => [p.id, ""])),
    chemical: Object.fromEntries(chemicalParameters.map((p) => [p.id, ""])),
  });

  const handleParameterChange = (
    category: ParameterCategory,
    id: string,
    value: string
  ) => {
    setParameters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [id]: value,
      },
    }));
  };

  const renderParameter = (
    category: "coal" | "clinker" | "chemical",
    { id, name, unit }: { id: string; name: string; unit: string }
  ) => (
    <div
      key={id}
      className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-0"
    >
      <Label className="w-32 text-sm">
        {name} ({unit})
      </Label>
      <Input
        type="number"
        value={parameters[category][id] || ""}
        onChange={(e) => handleParameterChange(category, id, e.target.value)}
        className="max-w-[120px]"
        placeholder="参数输入"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本生产信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>日期</Label>
              <Input
                type="date"
                value={parameters.basic.date}
                onChange={(e) =>
                  handleParameterChange("basic", "date", e.target.value)
                }
              />
            </div>
            <div>
              <Label>编号</Label>
              <Input
                value={parameters.basic.batchNumber}
                onChange={(e) =>
                  handleParameterChange("basic", "batchNumber", e.target.value)
                }
              />
            </div>
            <div>
              <Label>操作员</Label>
              <Input
                value={parameters.basic.operator}
                onChange={(e) =>
                  handleParameterChange("basic", "operator", e.target.value)
                }
              />
            </div>
            <div>
              <Label>模型版本</Label>
              <Select
                value={parameters.basic.modelVersion}
                onValueChange={(value) =>
                  handleParameterChange("basic", "modelVersion", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择模型版本" />
                </SelectTrigger>
                <SelectContent>
                  {modelVersions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>储存地址</Label>
            <Input
              value={parameters.basic.storagePath}
              disabled
              className="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>焦煤参数</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {coalParameters.map((param) => renderParameter("coal", param))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>生料化学成分</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {chemicalParameters.map((param) =>
              renderParameter("chemical", param)
            )}
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>熟料率值</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {clinkerParameters.map((param) => renderParameter("clinker", param))}
        </CardContent>
      </Card> */}
    </div>
  );
}
