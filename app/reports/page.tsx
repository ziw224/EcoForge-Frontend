"use client";

import { useState } from "react";
import { MetricCards } from "../components/report/MetricCards";
import { ProductionPerformance } from "../components/report/ProductionPerformance";
import { QualityAnalysis } from "../components/report/QualityAnalysis";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function Reports() {
  const [date, setDate] = useState<Date>();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">生产报告</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
          >
            全部
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
          >
            生产线
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>选择日期</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <p className="text-gray-400 mb-8">这里是您工厂的关键指标概览。</p>
      <MetricCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <ProductionPerformance />
        </div>
        <div>
          <QualityAnalysis />
        </div>
      </div>
    </main>
  );
}
