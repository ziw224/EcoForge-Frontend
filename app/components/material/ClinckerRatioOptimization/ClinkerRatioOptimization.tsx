"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ParameterInput } from "./ParameterInput";
import { OptimizationResults } from "./OptimizationResults";
import { OptimizationResult } from "@/types/common";
import { fetchOptimizationResults } from "../../../fetch/getResult";

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
  const [loadingResults, setLoadingResults] = useState(false); // New state for loading results

  // const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResult[] | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPollingRef = useRef(false); // Prevent multiple polling instances

  const fetchResults = async () => {
    const MAX_RETRIES = 5; // Maximum number of retry attempts
    const RETRY_DELAY = 3000; // Delay between retries in milliseconds

    let attempts = 0;

    setLoadingResults(true);
    setError(null); // Clear any existing error

    while (attempts < MAX_RETRIES) {
      try {
        const response = await fetchOptimizationResults(uid, taskId, companyId);
        const data = response.data;

        setResults([
          {
            id: 1, // default
            KH: data.Default.ratios.KH,
            N: data.Default.ratios.N,
            P: data.Default.ratios.P,
            strength: {
              "1d": data.Default.strength_1d,
              "3d": data.Default.strength_3d,
              "28d": data.Default.strength_28d,
            },
            chemical: data.Default.chemical_props,
          },
          {
            id: 2, // optimum
            KH: data.optimum.ratios.KH,
            N: data.optimum.ratios.N,
            P: data.optimum.ratios.P,
            strength: {
              "1d": data.optimum.strength_1d,
              "3d": data.optimum.strength_3d,
              "28d": data.optimum.strength_28d,
            },
            chemical: data.optimum.chemical_props,
          },
          {
            id: 3, // improvement
            KH: data.improvement.ratios.KH,
            N: data.improvement.ratios.N,
            P: data.improvement.ratios.P,
            strength: {
              "1d": data.improvement.strength_1d,
              "3d": data.improvement.strength_3d,
              "28d": data.improvement.strength_28d,
            },
            chemical: data.improvement.chemical_props,
          },
        ]);

        setLoadingResults(false);
        return; // Exit the loop on successful fetch
      } catch (err) {
        attempts += 1;
        console.warn(
          `Retry attempt ${attempts} failed. Retrying in ${
            RETRY_DELAY / 1000
          } seconds...`
        );

        if (attempts >= MAX_RETRIES) {
          setError("无法获取优化结果，请重试。");
          setLoadingResults(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // Wait before retrying
      }
    }
  };
  
  const handlePollProgress = async () => {
    try {
      await pollProgress(
        uid,
        taskId,
        companyId,
        async (data) => {
          setCurrentStage(
            `${data.data.desc || "进行中..."} (Progress: ${Math.floor(
              data.data.progress * 100
            )}%)`
          );

          if (
            data.data.desc === "Stage 3: Finding lower KH ratios" &&
            data.data.progress === 1
          ) {
            setIsOptimizing(false);
            setLoadingResults(true);
            await fetchResults(); // Fetch results after optimization completes
            setLoadingResults(false);
            onStepChange(2, true);
            onStepChange(3, false);
          }
        },
        (err) => {
          console.error("Polling error:", err);
          setError("优化过程中发生错误，请重试。");
          setIsOptimizing(false);
          onStepChange(2, false);
        },
        3000 // Increase polling interval to 3 seconds
      );
    } catch (err) {
      console.error("Unexpected error during polling:", err);
    }
  };

  const handleOptimize = async () => {
    console.log("Starting optimization with:");
    console.log("UID:", uid);
    console.log("Task ID:", taskId);
    console.log("Company ID:", companyId);

    setResults(null);
    setIsOptimizing(true);
    setCurrentStage("准备优化...");
    setError(null);
    onStepChange(1, true);
    onStepChange(2, false);

    await handlePollProgress(); // Start polling and wait for completion
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
              <div className="flex items-center space-x-4">
                {/* Optimizing Status */}
                <div
                  className={`text-center px-4 py-2 rounded-lg ${
                    isOptimizing
                      ? "bg-gray-500 text-white"
                      : results
                      ? "bg-green-500 text-white"
                      : ""
                  }`}
                >
                  {isOptimizing ? "正在优化..." : results ? "优化完成" : ""}
                </div>

                {/* Reset Button */}
                {isOptimizing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOptimizing(false);
                      setCurrentStage("准备优化...");
                      setResults(null);
                      setError(null);
                      console.log("Optimization reset.");
                    }}
                    className="bg-red-500 text-white hover:bg-red-600 transition-colors px-4 py-2 rounded-lg shadow-md ml-auto"
                  >
                    重置任务
                  </Button>
                )}
              </div>

              {/* Current Stage Display */}
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
