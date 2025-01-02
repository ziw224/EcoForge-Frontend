import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { startOptimization } from "../../../fetch/startOptimization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LocalParameter = {
  id: string;
  name: string;
  unit: string;
  visible: boolean;
  value?: string;
};

type ParameterCategory = "basic" | "coal" | "chemical";

const defaultStoragePath = "/data/predictions/cement-strength/";

const modelVersions = [
  { id: "v1.0", name: "Version 1.0 - 基础版" },
  { id: "v1.1", name: "Version 1.1 - 优化版" },
  { id: "v2.0", name: "Version 2.0 - 高级版" },
];

const coalParameters: LocalParameter[] = [
  { id: "Wf", name: "全水", unit: "Wf", visible: true },
  { id: "Minh", name: "内水", unit: "Minh", visible: true },
  { id: "Aad", name: "灰分", unit: "Aad", visible: true },
  { id: "Vad", name: "挥发分", unit: "Vad", visible: true },
  { id: "FC", name: "固定碳", unit: "FC", visible: true },
  { id: "S", name: "硫含量", unit: "S", visible: true },
  { id: "GAR", name: "热值", unit: "GAR", visible: true },
  { id: "JG", name: "J/G", unit: "J/G", visible: true },
  { id: "Qgr", name: "空干基发热量", unit: "Qgr", visible: true },
];

const chemicalParameters: LocalParameter[] = [
  { id: "I-LOSS", name: "烧失量", unit: "I-LOSS", visible: true },
  { id: "I-SiO2", name: "二氧化硅", unit: "I-SiO2", visible: true },
  { id: "I-Al2O3", name: "三氧化二铝", unit: "I-Al2O3", visible: true },
  { id: "I-Fe2O3", name: "三氧化二铁", unit: "I-Fe2O3", visible: true },
  { id: "I-CaO", name: "氧化钙", unit: "I-CaO", visible: true },
  { id: "I-MgO", name: "氧化镁", unit: "I-MgO", visible: true },
  { id: "I-SO3", name: "三氧化硫", unit: "I-SO3", visible: true },
  { id: "I-Na2O", name: "氧化钠", unit: "I-Na2O", visible: true },
  { id: "I-K2O", name: "氧化钾", unit: "I-K2O", visible: true },
  { id: "I-R2O", name: "碱含量", unit: "I-R2O", visible: true },
  { id: "I-CL", name: "氯离子", unit: "I-CL", visible: true },
];


interface ParameterInputProps {
  uid: string;
  taskId: string;
  companyId: string;
  onOptimizeStart: () => void;
}

export function ParameterInput({
  uid,
  taskId,
  companyId,
  onOptimizeStart,
}: ParameterInputProps) {
  const initialParameters = () => {
    const savedParameters = localStorage.getItem("optimization_parameters");
    if (savedParameters) {
      return JSON.parse(savedParameters);
    }
    return {
      basic: {
        date: new Date().toISOString().split("T")[0],
        batchNumber: "",
        operator: "",
        modelVersion: "v2.0",
        storagePath: defaultStoragePath,
      },
      coal: coalParameters,
      chemical: chemicalParameters,
    };
  };

  const [parameters, setParameters] = useState(initialParameters);
  const [editMode, setEditMode] = useState({
    coal: false,
    chemical: false,
  });

  useEffect(() => {
    localStorage.setItem("optimization_parameters", JSON.stringify(parameters));
  }, [parameters]);

  const handleOptimizationStart = async () => {
    try {
      const formData = new FormData();

      // // Append basic parameters
      // Object.entries(parameters.basic).forEach(([key, value]) => {
      //   formData.append(key, String(value));
      // });

      // Append visible coal parameters
      parameters.coal
        .filter(
          (param) =>
            param.visible && param.value !== undefined && param.value !== ""
        )
        .forEach((param) => {
          formData.append(param.id, String(param.value));
        });

      // Append visible chemical parameters
      parameters.chemical
        .filter(
          (param) =>
            param.visible && param.value !== undefined && param.value !== ""
        )
        .forEach((param) => {
          formData.append(param.id, String(param.value));
        });

      // // Print FormData for debugging
      // console.log("FormData Contents:");
      // Array.from(formData.entries()).forEach(([key, value]) => {
      //   console.log(`${key}: ${value}`);
      // });

      // Send data to API
      const response = await startOptimization(
        uid,
        taskId,
        companyId,
        formData
      );

      console.log("Optimization started successfully:", response.msg);
      onOptimizeStart();
    } catch (error) {
      console.error("Error starting optimization:", error);
    }
  };

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
      {editMode[category as keyof typeof editMode] && (
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
                    handleParameterChange(
                      "basic",
                      "batchNumber",
                      e.target.value
                    )
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
                    {/* hiii */}
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
            <div className="flex flex-col items-center space-y-2 mt-4">
              <Button
                variant="outline"
                className=" w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, coal: !prev.coal }))
                }
              >
                {editMode.coal ? "保存" : "编辑参数"}
              </Button>
              <Button
                onClick={() =>
                  setParameters((prev) => ({
                    ...prev,
                    coal: coalParameters.map((param) => ({
                      ...param,
                      value: "", // Reset the value to empty
                    })),
                  }))
                }
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-100"
              >
                一键清空
              </Button>
            </div>
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
            <div className="flex flex-col items-center space-y-2 mt-4">
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, chemical: !prev.chemical }))
                }
              >
                {editMode.chemical ? "保存" : "编辑参数"}
              </Button>
              <Button
                onClick={() =>
                  setParameters((prev) => ({
                    ...prev,
                    chemical: chemicalParameters.map((param) => ({
                      ...param,
                      value: "", // Reset the value to empty
                    })),
                  }))
                }
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-100"
              >
                一键清空
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleOptimizationStart}
        size="lg"
        className="bg-blue-500 w-full"
      >
        开始优化
      </Button>
    </div>
  );
}
