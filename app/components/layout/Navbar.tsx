"use client";

import {
  Home,
  BarChart2,
  Database,
  FlaskRoundIcon as Flask,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "首页", path: "/" },
  { icon: Flask, label: "材料智能", path: "/material" },
  { icon: BarChart2, label: "报告", path: "/reports" },
  { icon: Database, label: "数据库", path: "/database" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">EcoMatrix</span>
            <span className="ml-4 text-gray-400">
              / 超级稳定水泥集团 / 烟台工厂
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              更新日志
            </button>
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          </div>
        </div>
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-2 py-4 border-b-2 ${
                pathname === item.path
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              } transition-colors`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
