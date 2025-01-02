"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchPredictionResult } from "../../../fetch/getResult";
import ErrorBoundary from "../../common/ErrorBoundary";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { PredictionResults } from "../PredictionResults";

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

interface StrengthPredictionProps {
  uid: string;
  taskId: string;
  companyId: string;
  onStepChange: (stepId: number, completed: boolean) => void;
}

const defaultStoragePath = "/data/predictions/cement-strength/";

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

const clinkerParameters: LocalParameter[] = [
  { id: "KH", name: "石灰石饱和度", unit: "KH", visible: true },
  { id: "N", name: "硅率", unit: "N", visible: true },
  { id: "P", name: "铝率", unit: "P", visible: true },
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

interface PredictionResultsProps {
  results: {
    strength?: {
      [key: string]: { value: number; confidence: number };
    };
    chemical?: any; // Adjust type as necessary
  };
}

export function StrengthPrediction({
  uid,
  taskId,
  companyId,
  onStepChange,
}: StrengthPredictionProps) {
  const initialParameters = () => {
    const savedParameters = localStorage.getItem("prediction_parameters");
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
      clinker: clinkerParameters,
      chemical: chemicalParameters,
    };
  };

  const [parameters, setParameters] = useState(initialParameters);
  const [editMode, setEditMode] = useState({
    coal: false,
    chemical: false,
    clinker: false,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("prediction_parameters", JSON.stringify(parameters));
  }, [parameters]);

  const handleParameterChange = (
    category: "basic" | "coal" | "chemical" | "clinker",
    id: string,
    value: string
  ) => {
    setParameters((prev) => ({
      ...prev,
      [category]:
        category === "basic"
          ? { ...prev[category], [id]: value }
          : (prev[category] as any[]).map((param) =>
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

  const handleFetchPrediction = async () => {
    try {
      setLoadingResults(true);

      const formData = new FormData();

      // // Append basic parameters
      // Object.entries(parameters.basic).forEach(([key, value]) => {
      //   formData.append(key, String(value));
      // });

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

      // Append visible clinker parameters
      parameters.clinker
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

      const response = await fetchPredictionResult(
        uid,
        taskId,
        companyId,
        formData
      );

      console.log(response);
      const formattedResults = {
        strength: {
          "1d": {
            value: response.data.strength_result.predictions["1d"],
            confidence: 0.5,
          },
          "3d": {
            value: response.data.strength_result.predictions["3d"],
            confidence: 1.0,
          },
          "28d": {
            value: response.data.strength_result.predictions["28d"],
            confidence: 1.5,
          },
        },
        chemical: response.data.features_result,
      };

      setResults(formattedResults);

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setLoadingResults(false);
    } catch (err) {
      console.error("Error fetching prediction results:", err);
      setError("无法获取预测结果，请重试。");
      setLoadingResults(false);
    }
  };

  const handleOptimize = async () => {
    // console.log("Starting prediction with parameters:", parameters);

    setResults(null);
    setIsOptimizing(true);
    setProgress(0);
    setError(null);

    await handleFetchPrediction();

    setIsOptimizing(false);
  };

  return (
    <ErrorBoundary fallback={<div>出错了，请刷新页面重试。</div>}>
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
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
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
                    setEditMode((prev) => ({
                      ...prev,
                      chemical: !prev.chemical,
                    }))
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

        {Array.isArray(parameters.clinker) && parameters.clinker.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>熟料率值</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {parameters.clinker.map((param) =>
                renderParameter("clinker", param)
              )}
              <div className="flex items-center justify-between mt-4 space-x-4">
                <Button
                  variant="outline"
                  className="w-1/2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => {
                    setEditMode((prev) => ({
                      ...prev,
                      clinker: !prev.clinker,
                    }));
                  }}
                >
                  {editMode.clinker ? "保存" : "编辑参数"}
                </Button>
                <Button
                  onClick={() =>
                    setParameters((prev) => ({
                      ...prev,
                      clinker: prev.clinker.map((param) => ({
                        ...param,
                        value: "", // Reset each parameter's value to empty
                      })),
                    }))
                  }
                  variant="outline"
                  className="w-1/2 border-red-500 text-red-500 hover:bg-red-100"
                >
                  一键清空
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleOptimize}
              disabled={isOptimizing}
              size="lg"
              className={
                isOptimizing ? "bg-gray-600" : results ? "bg-green-600" : ""
              }
            >
              {isOptimizing
                ? "强度预测中..."
                : results
                ? "预测完成"
                : "开始预测"}
            </Button>
            {isOptimizing && (
              <Progress value={progress} className="flex-1 ml-4 bg-gray-700" />
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
      )}
      {isOptimizing && <LoadingSpinner />}
      {!isOptimizing && results && <PredictionResults results={results} />}
    </ErrorBoundary>
  );
}
