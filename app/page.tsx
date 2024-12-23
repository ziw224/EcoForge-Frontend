"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart2,
  Database,
  FlaskRoundIcon as Flask,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "材料智能",
    description: "立即开始参数输入，获取智能优化建议",
    icon: Flask,
    href: "/material",
    buttonText: "使用智能助手",
  },
  {
    title: "生产报告",
    description: "查看详细的生产数据分析和趋势",
    icon: BarChart2,
    href: "/reports",
    buttonText: "查看多维度报告",
  },
  {
    title: "数据库",
    description: "管理和查询历史生产数据",
    icon: Database,
    href: "/database",
    buttonText: "进入",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          EcoMatrix 水泥材料智能代理系统
        </h1>
        <p className="text-xl text-gray-300">
          通过智能算法优化生产参数，提高产品质量，降低能源消耗
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col hover:shadow-lg transition-shadow bg-gray-800 border-gray-700"
          >
            <CardHeader>
              <feature.icon className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-gray-100">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-400">{feature.description}</p>
            </CardContent>
            <CardFooter className="pt-4">
              <Link href={feature.href} className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 transition-colors"
                >
                  {feature.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
