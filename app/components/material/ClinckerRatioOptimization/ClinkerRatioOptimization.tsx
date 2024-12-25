"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ParameterInput } from "./ParameterInput";
import { OptimizationResults } from "./OptimizationResults";
import { OptimizationResult } from "@/types/common";

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
import ErrorBoundary from "../../common/ErrorBoundary";
import { pollProgress } from "../../../fetch/progressCheck";
import { LoadingSpinner } from "../../common/LoadingSpinner";

interface ClinkerRatioOptimizationProps {
  uid: string;
  taskId: string;
  companyId: string;
  onStepChange: (stepId: number, completed: boolean) => void;
}

export function ClinkerRatioOptimization({
  uid,
  taskId,
  companyId,
  onStepChange,
}: ClinkerRatioOptimizationProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(
    "准备优化..."
  );
  // const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResult[] | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // console.log("useEffect triggered:");
    // console.log("UID:", uid);
    // console.log("Task ID:", taskId);
    // console.log("Company ID:", companyId);

    let stopPolling: (() => void) | undefined;

    if (isOptimizing) {
      stopPolling = pollProgress(
        uid,
        taskId,
        companyId,
        (data) => {
          console.log("Polling progress response:", data);
          setCurrentStage(
            `${data.data.desc || "进行中..."} (Progress: ${Math.floor(
              data.data.progress * 100
            )}%)`
          );
          if (data.data.progress === 1) {
            // Stop polling when progress completes
            setIsOptimizing(false);
            onStepChange(2, true);
            onStepChange(3, false);
          }
        },
        (err) => {
          console.error("Polling error:", err);
          setError("优化过程中发生错误，请重试。");
          setIsOptimizing(false);
          onStepChange(2, false);
        }
      );
    }

    return () => {
      if (stopPolling) stopPolling();
    };
  }, [isOptimizing, uid, taskId, companyId, onStepChange]);

  const handleOptimize = () => {
    console.log("Starting optimization with:");
    console.log("UID:", uid);
    console.log("Task ID:", taskId);
    console.log("Company ID:", companyId);

    setIsOptimizing(true);
    setCurrentStage("准备优化...");
    setError(null);
    onStepChange(1, true);
    onStepChange(2, false);
    // Simulate optimization process
    // for (let i = 0; i <= 100; i += 10) {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   setProgress(i);
    // }

    // Simulate result data
    const optimizationResults: OptimizationResult[] = [
      {
        id: 1,
        KH: 0.9222,
        N: 2.35,
        P: 1.45,
        strength: {
          "1d": 15.5,
          "3d": 31.4,
          "28d": 58.7,
        },
        chemical: {
          "SiO₂": 22.12,
          "Al₂O₃": 5.08,
          "Fe₂O₃": 3.41,
          "CaO": 64.59,
          "MgO": 2.54,
          "SO₃": 0.53,
          "f-CaO": 0.99,
          "Na₂O": 0.25,
          "K₂O": 0.9,
          "Cl⁻": 0.025,
        },
      },
      {
        id: 2,
        KH: 0.9,
        N: 2.4,
        P: 1.5,
        strength: {
          "1d": 14.8,
          "3d": 30.9,
          "28d": 59.2,
        },
        chemical: {
          "SiO₂": 21.98,
          "Al₂O₃": 5.12,
          "Fe₂O₃": 3.38,
          "CaO": 64.21,
          "MgO": 2.56,
          "SO₃": 0.54,
          "f-CaO": 0.97,
          "Na₂O": 0.26,
          "K₂O": 0.91,
          "Cl⁻": 0.024,
        },
      },
      {
        id: 3,
        KH: 0.94,
        N: 2.3,
        P: 1.4,
        strength: {
          "1d": 16.2,
          "3d": 32.1,
          "28d": 58.3,
        },
        chemical: {
          "SiO₂": 22.26,
          "Al₂O₃": 5.04,
          "Fe₂O₃": 3.44,
          "CaO": 64.97,
          "MgO": 2.52,
          "SO₃": 0.52,
          "f-CaO": 1.01,
          "Na₂O": 0.24,
          "K₂O": 0.89,
          "Cl⁻": 0.026,
        },
      },
    ];

    setResults(optimizationResults);
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    setShowSaveDialog(false);
    onStepChange(3, true);
    onStepChange(4, false);
    // Add save logic here
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
                <div
                  className={`text-center px-4 py-2 rounded-lg ${
                    isOptimizing
                      ? "bg-gray-500 text-white"
                      : results
                      ? "bg-green-500 text-white"
                      : ""
                  }`}
                >
                  {isOptimizing
                    ? "正在优化..." 
                    : results
                    ? "优化完成" 
                    : ""}
                </div>
              </div>

              {isOptimizing && (
                <div className="text-gray-600 text-sm mt-2 text-center">
                  当前阶段：{currentStage}
                </div>
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
            <OptimizationResults results={results} />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleSave}>
                保存优化结果
              </Button>
              <Button onClick={handleSave}>采纳建议并保存</Button>
            </div>
          </>
        )}

        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>保存优化方案</AlertDialogTitle>
              <AlertDialogDescription>
                是否确认保存当前优化方案？保存后可在数据库中查看和管理。
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
