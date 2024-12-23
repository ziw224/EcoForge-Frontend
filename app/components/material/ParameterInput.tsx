"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type LocalParameter = {
  id: string;
  name: string;
  unit: string;
  visible: boolean;
  value?: string;
};

type ParameterCategory = "basic" | "coal" | "chemical" | "clinker";

const modelVersions = [
  { id: "v1.0", name: "Version 1.0 - 基础版" },
  { id: "v1.1", name: "Version 1.1 - 优化版" },
  { id: "v2.0", name: "Version 2.0 - 高级版" },
];

const defaultStoragePath = "/data/predictions/cement-strength/";

const coalParameters: LocalParameter[] = [
  { id: "Wf", name: "内水", unit: "Wf", visible: true },
  { id: "Minh", name: "外水", unit: "Minh", visible: true },
  { id: "Aad", name: "灰分", unit: "Aad", visible: true },
  { id: "FC", name: "固定碳", unit: "FC", visible: true },
  { id: "S", name: "硫含量", unit: "S", visible: true },
  { id: "GAR", name: "煤粉细度", unit: "GAR", visible: true },
  { id: "JG", name: "热值", unit: "J/G", visible: true },
  { id: "Qgr", name: "热功率", unit: "Qgr", visible: true },
];

const clinkerParameters: LocalParameter[] = [
  { id: "KH", name: "石灰石饱和度", unit: "KH", visible: true },
  { id: "N", name: "硅率", unit: "N", visible: true },
  { id: "P", name: "铝率", unit: "P", visible: true },
];

const chemicalParameters: LocalParameter[] = [
  { id: "l-LOSS", name: "烧失量", unit: "l-LOSS", visible: true },
  { id: "l-SiO2", name: "二氧化硅", unit: "l-SiO2", visible: true },
  { id: "l-Al2O3", name: "三氧化二铝", unit: "l-Al2O3", visible: true },
  { id: "l-Fe2O3", name: "三氧化二铁", unit: "l-Fe2O3", visible: true },
  { id: "l-CaO", name: "氧化钙", unit: "l-CaO", visible: true },
  { id: "l-MgO", name: "氧化镁", unit: "l-MgO", visible: true },
  { id: "l-SO3", name: "三氧化硫", unit: "l-SO3", visible: true },
  { id: "l-Na2O", name: "氧化钠", unit: "l-Na2O", visible: true },
  { id: "l-K2O", name: "氧化钾", unit: "l-K2O", visible: true },
  { id: "l-R2O", name: "碱含量", unit: "l-R2O", visible: true },
  { id: "l-CL", name: "氯离子", unit: "l-CL", visible: true },
];

interface ParameterInputProps {
  excludeParameters?: string[];
}

export function ParameterInput({
  excludeParameters = [],
}: ParameterInputProps) {
  const [parameters, setParameters] = useState({
    basic: {
      date: new Date().toISOString().split("T")[0],
      batchNumber: "",
      operator: "",
      modelVersion: "v2.0",
      storagePath: defaultStoragePath,
    },
    coal: coalParameters,
    clinker: clinkerParameters.filter(
      (param) => !excludeParameters.includes(param.id)
    ),
    chemical: chemicalParameters,
  });

  const [editMode, setEditMode] = useState<{
    coal: boolean;
    chemical: boolean;
    clinker: boolean;
  }>({
    coal: false,
    chemical: false,
    clinker: false,
  });

  const handleParameterChange = (
    category: ParameterCategory,
    id: string,
    value: string
  ) => {
    setParameters((prev) => ({
      ...prev,
      [category]:
        category === "basic"
          ? { ...prev[category], [id]: value }
          : (prev[category] as LocalParameter[]).map((param) =>
              param.id === id ? { ...param, value } : param
            ),
    }));
  };

  const renderParameter = (
    category: ParameterCategory,
    param: LocalParameter
  ) => (
    <div
      key={param.id}
      className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-0"
    >
      {category !== "basic" && editMode[category as keyof typeof editMode] && (
        <Switch
          checked={param.visible}
          onCheckedChange={() =>
            setParameters((prev) => ({
              ...prev,
              [category]: (prev[category] as LocalParameter[]).map((p) =>
                p.id === param.id ? { ...p, visible: !p.visible } : p
              ),
            }))
          }
          aria-label={`Toggle ${param.name}`}
        />
      )}
      <Label className="w-40 text-sm">
        {param.name} ({param.unit})
      </Label>
      {param.visible && (
        <Input
          type="number"
          value={
            (parameters[category] as LocalParameter[]).find(
              (p) => p.id === param.id
            )?.value || ""
          }
          onChange={(e) =>
            handleParameterChange(category, param.id, e.target.value)
          }
          className="max-w-[120px]"
          placeholder="参数输入"
        />
      )}
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
            {parameters.coal.map((param) => renderParameter("coal", param))}
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                setEditMode((prev) => ({ ...prev, coal: !prev.coal }));
              }}
            >
              {editMode.coal ? "保存" : "编辑参数"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>生料化学成分</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {parameters.chemical.map((param) =>
              renderParameter("chemical", param)
            )}
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                setEditMode((prev) => ({ ...prev, chemical: !prev.chemical }));
              }}
            >
              {editMode.chemical ? "保存" : "编辑参数"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {parameters.clinker.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>熟料率值</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {parameters.clinker.map((param) =>
              renderParameter("clinker", param)
            )}
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                setEditMode((prev) => ({ ...prev, clinker: !prev.clinker }));
              }}
            >
              {editMode.clinker ? "保存" : "编辑参数"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
