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

interface StrengthPredictionProps {
  onStepChange: (stepId: number, completed: boolean) => void;
}

export function StrengthPrediction({ onStepChange }: StrengthPredictionProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setProgress(0);
    onStepChange(1, true);
    onStepChange(2, false);

    // 模拟优化过程
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(i);
    }

    setResults({
      strength: {
        "1d": { value: 15.09, confidence: 0.5 }, // Assuming confidence remains static
        "3d": { value: 31.38, confidence: 1.0 },
        "28d": { value: 54.73, confidence: 1.5 },
      },
      chemical: {
        "SiO₂": 22.19, // Rounded from SiO2
        "Al₂O₃": 5.26, // Rounded from Al2O3
        "Fe₂O₃": 3.47, // Rounded from Fe2O3
        CaO: 64.75,
        MgO: 2.93,
        "SO₃": 0.46, // Rounded from SO3
        "f-CaO": 1.78, // Rounded from f-Ca0
        "R₂O": 0.76, // Rounded from R2O
        LOSS: 0.34,
      },
    });

    setIsOptimizing(false);
    onStepChange(2, true);
    onStepChange(3, false);
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    setShowSaveDialog(false);
    onStepChange(3, true);
    onStepChange(4, false);
    // 实际保存逻辑
  };

  return (
    <div className="space-y-6">
      <ParameterInput />

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
              <div className="flex-1 ml-4">
                <Progress value={progress} className="bg-gray-700" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <PredictionResults results={results} />
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleSave}>
              保存预测结果
            </Button>
            <Button onClick={handleSave}>采纳建议并保存</Button>
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
  );
}