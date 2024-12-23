"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrengthPrediction } from "../components/material/StrengthPrediction/StrengthPrediction";
import { ClinkerRatioOptimization } from "../components/material/ClinckerRatioOptimization/ClinkerRatioOptimization";
import { RawMaterialOptimization } from "../components/material/RawMaterial/RawMaterialOptimization";
import { CementMixOptimization } from "../components/material/CementMix/CementMixOptimization";
import { StepNavigation } from "../components/material/StepNavigation";

const initialSteps = [
  {
    id: 1,
    title: "数据输入",
    subtitle: "基本信息与参数录入",
    completed: false,
    current: true,
  },
  {
    id: 2,
    title: "材料优化",
    subtitle: "智能优化计算",
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
  const [currentSteps, setCurrentSteps] = useState(initialSteps);
  const [activeStep, setActiveStep] = useState(1);

  // Array of refs for step sections
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleStepChange = (stepId: number, completed: boolean) => {
    setCurrentSteps((prev) =>
      prev.map((step) => ({
        ...step,
        current: step.id === stepId,
        completed: completed ? step.completed || step.id <= stepId : false,
      }))
    );
    setActiveStep(stepId);

    // Scroll to the corresponding section
    const section = sectionsRef.current[stepId - 1];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          EcoMatrix 水泥材料智能代理系统
        </h1>
        <p className="text-xl text-gray-400">
          科学驱动的AI智能体帮助您提高材料利用效率，深度释放材料自身潜力。
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 order-2 lg:order-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <Tabs defaultValue="strength" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent p-1">
                  <TabsTrigger value="strength" className="tab-button">
                    熟料强度预测
                  </TabsTrigger>
                  <TabsTrigger value="clinker-ratio" className="tab-button">
                    熟料率值优化
                  </TabsTrigger>
                  <TabsTrigger value="raw-material" className="tab-button">
                    生料配比优化
                  </TabsTrigger>
                  <TabsTrigger value="cement-mix" className="tab-button">
                    水泥配比优化
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="strength">
                  <div
                    id="step-1"
                    ref={(el) => {
                      sectionsRef.current[0] = el; 
                    }}
                    data-step="1"
                    className="py-8"
                  >
                    <StrengthPrediction onStepChange={handleStepChange} />
                  </div>
                </TabsContent>
                <TabsContent value="clinker-ratio">
                  <div
                    id="step-2"
                    ref={(el) => {
                      sectionsRef.current[1] = el;
                    }}
                    data-step="2"
                    className="py-8"
                  >
                    <ClinkerRatioOptimization onStepChange={handleStepChange} />
                  </div>
                </TabsContent>
                <TabsContent value="raw-material">
                  <div
                    id="step-3"
                    ref={(el) => {
                      sectionsRef.current[2] = el;
                    }}
                    data-step="3"
                    className="py-8"
                  >
                    <RawMaterialOptimization />
                  </div>
                </TabsContent>
                <TabsContent value="cement-mix">
                  <div
                    id="step-4"
                    ref={(el) => {
                      sectionsRef.current[3] = el;
                    }}
                    data-step="4"
                    className="py-8"
                  >
                    <CementMixOptimization />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-64 order-1 lg:order-2">
          <Card className="bg-gray-800 border-gray-700 sticky top-8">
            <CardContent className="p-4">
              <StepNavigation
                steps={currentSteps}
                onStepClick={(stepId) =>
                  handleStepChange(stepId, currentSteps[stepId - 1]?.completed)
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
