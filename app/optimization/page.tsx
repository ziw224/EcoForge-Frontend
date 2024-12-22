"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { StrengthPrediction } from "../components/optimization/StrengthPrediction";

export default function OptimizationPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">参数优化</h1>
          <p className="text-gray-600 mt-2">智能优化系统</p>
        </div>
      </div>

      <Tabs defaultValue="strength" className="space-y-4">
        <TabsList>
          <TabsTrigger value="strength">水泥熟料强度预测</TabsTrigger>
          <TabsTrigger value="energy" disabled>
            能耗优化
          </TabsTrigger>
          <TabsTrigger value="quality" disabled>
            质量控制
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strength">
          <StrengthPrediction />
        </TabsContent>
      </Tabs>
    </main>
  );
}
