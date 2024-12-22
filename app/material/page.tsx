"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { StrengthPrediction } from "../components/material/StrengthPrediction";
import { StepNavigation } from "../components/material/StepNavigation";

const steps = [
  {
    id: 1,
    title: "数据输入",
    subtitle: "基本信息与参数录入",
    completed: false,
    current: true,
  },
  {
    id: 2,
    title: "材料预测",
    subtitle: "智能预测计算",
    completed: false,
    current: false,
  },
  {
    id: 3,
    title: "分析结果",
    subtitle: "查看分析结果",
    completed: false,
    current: false,
  },
  {
    id: 4,
    title: "方案状态",
    subtitle: "确认并保存方案",
    completed: false,
    current: false,
  },
];

export default function MaterialPage() {
  const [currentSteps, setCurrentSteps] = useState(steps);
  const [activeStep, setActiveStep] = useState(1);

  const handleStepChange = (stepId: number) => {
    setActiveStep(stepId);
    setCurrentSteps((prev) =>
      prev.map((step) => ({
        ...step,
        current: step.id === stepId,
        completed: step.id < stepId,
      }))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          EcoMatrix 水泥材料智能代理系统
        </h1>
        <p className="text-gray-400">智能优化您的生产工艺参数</p>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">材料智能</CardTitle>
            </CardHeader>
            <CardContent>
              {activeStep === 1 && (
                <StrengthPrediction
                  onStepChange={(stepId, completed) => {
                    setCurrentSteps((prev) =>
                      prev.map((step) =>
                        step.id === stepId
                          ? { ...step, completed, current: !completed }
                          : step.id === stepId + 1
                          ? { ...step, current: completed }
                          : step
                      )
                    );
                  }}
                />
              )}
              {/* Add other step components here when implemented */}
            </CardContent>
          </Card>
        </div>

        <div className="w-64">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <StepNavigation
                steps={currentSteps}
                onStepClick={handleStepChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
