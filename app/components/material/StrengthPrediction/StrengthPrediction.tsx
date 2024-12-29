"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ParameterInput } from "./ParameterInput";
import { PredictionResults } from "../PredictionResults";
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
import { fetchPredictionResult } from "../../../fetch/getResult";
import ErrorBoundary from "../../common/ErrorBoundary";
import { LoadingSpinner } from "../../common/LoadingSpinner";

interface StrengthPredictionProps {
  uid: string;
  taskId: string;
  companyId: string;
  onStepChange: (stepId: number, completed: boolean) => void;
}

export function StrengthPrediction({
  uid,
  taskId,
  companyId,
  onStepChange,
}: StrengthPredictionProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string | null>(
    "准备预测..."
  );
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPrediction = async () => {
    try {
      setLoadingResults(true);

      const formData = new FormData();
      formData.append("Wf", String(10.0));
      formData.append("Minh", String(2.22));
      formData.append("Aad", String(17.77));
      formData.append("Vad", String(28.66));
      formData.append("S", String(0.62));
      formData.append("GAR", String(5548.0));
      formData.append("I-LOSS", String(35.94));
      formData.append("I-SiO2", String(13.58));
      formData.append("I-Al2O3", String(3.14));
      formData.append("I-Fe2O3", String(2.1));
      formData.append("I-CaO", String(42.6));
      formData.append("I-MgO", String(1.44));
      formData.append("I-R2O", String(0.51));
      formData.append("I-CL", String(0.02));
      formData.append("KH", String(0.92));
      formData.append("N", String(2.2));
      formData.append("P", String(1.3));

      // Print FormData for debugging
      console.log("FormData Contents:");
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      const response = await fetchPredictionResult(
        uid,
        taskId,
        companyId,
        formData
      );
      console.log(response);

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

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
      setLoadingResults(false);
      setIsOptimizing(false);
    } catch (err) {
      console.error("Error fetching prediction results:", err);
      setError("无法获取预测结果，请重试。");
      setLoadingResults(false);
    }
  };

  // Handles optimization start
  const handleOptimize = async () => {
    console.log("Starting prediction with:", { uid, taskId, companyId });

    setResults(null);
    setIsOptimizing(true);
    setProgress(0);
    setCurrentStage("准备预测...");
    setError(null);

    onStepChange(1, true);
    onStepChange(2, false);

    await handleFetchPrediction();

    setIsOptimizing(false);
    onStepChange(2, true);
    onStepChange(3, false);
  };

  // Handles save confirmation
  const handleConfirmSave = () => {
    setShowSaveDialog(false);
    onStepChange(3, true);
    onStepChange(4, false);
    // Save logic here
  };

  return (
    <ErrorBoundary fallback={<div>出错了，请刷新页面重试。</div>}>
      <div className="space-y-6">
        <ParameterInput
          uid={uid}
          taskId={taskId}
          companyId={companyId}
          onOptimizeStart={handleOptimize}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-x-4">
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
                  <Button
                    variant="outline"
                    onClick={() => setIsOptimizing(false)}
                  >
                    取消
                  </Button>
                )}
              </div>
              {isOptimizing && (
                <Progress
                  value={progress}
                  className="flex-1 ml-4 bg-gray-700"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
        )}
        {isOptimizing && <LoadingSpinner />}
        {!isOptimizing && results && (
          <>
            <PredictionResults results={results} />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                保存预测结果
              </Button>
              <Button onClick={() => setShowSaveDialog(true)}>
                采纳建议并保存
              </Button>
            </div>
          </>
        )}

        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>保存预测结果</AlertDialogTitle>
              <AlertDialogDescription>
                是否确认保存当前预测结果？保存后可在数据库中查看和管理。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSave}>
                确认保存
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
}
