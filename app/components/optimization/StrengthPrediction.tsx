"use client";

import { useState } from "react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { ParameterInput } from "./ParameterInput";
import { PredictionResults } from "./PredictionResults";

export function StrengthPrediction() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setProgress(0);

    // 模拟优化过程
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(i);
    }

    // 模拟结果数据
    setResults({
      strength: {
        "1d": 15.5,
        "3d": 31.4,
        "28d": 58.7,
      },
      chemical: {
        major: {
          "SiO₂": 22.12,
          "Al₂O₃": 5.08,
          "Fe₂O₃": 3.41,
          CaO: 64.59,
          MgO: 2.54,
        },
        minor: {
          "SO₃": 0.53,
          "f-CaO": 0.99,
        },
        alkali: {
          "Na₂O": 0.25,
          "K₂O": 0.9,
          "R₂O": 0.84,
        },
        other: {
          "Cl⁻": 0.025,
          Total: 98.48,
        },
      },
    });

    setIsOptimizing(false);
  };

  return (
    <div className="space-y-6">
      <ParameterInput />

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handleOptimize} disabled={isOptimizing} size="lg">
              开始优化
            </Button>
            {isOptimizing && (
              <div className="flex-1 ml-4">
                <Progress value={progress} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results && <PredictionResults results={results} />}
    </div>
  );
}
