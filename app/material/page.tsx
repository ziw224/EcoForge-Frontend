"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrengthPrediction } from "../components/material/StrengthPrediction/StrengthPrediction";
import { ClinkerRatioOptimization } from "../components/material/ClinckerRatioOptimization/ClinkerRatioOptimization";
import { RawMaterialOptimization } from "../components/material/RawMaterial/RawMaterialOptimization";
import { CementMixOptimization } from "../components/material/CementMix/CementMixOptimization";
import { StepNavigation } from "../components/material/StepNavigation";
import { useUser } from "../context/userContext"; // Import your useUser hook

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
  const { user } = useUser(); // Retrieve user details from the context

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

  const handleTabChange = (value: string) => {
    setCurrentSteps(initialSteps);
    setActiveStep(1);
  };

  if (!user) {
    return <div>用户未登录，请先登录。</div>;
  }

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
        {/* Main content */}
        <div className="flex-1 order-2 lg:order-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <Tabs
                defaultValue="strength"
                className="space-y-6"
                onValueChange={handleTabChange}
              >
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
                  <StrengthPrediction
                    uid={user.username}
                    companyId={user.companyId} 
                    taskId="123456789"
                    onStepChange={handleStepChange}
                  />
                </TabsContent>
                <TabsContent value="clinker-ratio">
                  <ClinkerRatioOptimization
                    uid={user.username}
                    companyId={user.companyId} 
                    taskId="02282002"
                    onStepChange={handleStepChange}
                  />
                  {/* <ClinkerRatioOptimization onStepChange={handleStepChange} /> */}
                </TabsContent>
                <TabsContent value="raw-material">
                  <RawMaterialOptimization />
                </TabsContent>
                <TabsContent value="cement-mix">
                  <CementMixOptimization />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sticky navigation */}
        <div className="w-full lg:w-64 order-1 lg:order-2">
          <div className="sticky top-4">
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
    </div>
  );
}
