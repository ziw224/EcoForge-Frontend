"use client";

import {
  Home,
  BarChart2,
  Database,
  FlaskRoundIcon as Flask,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "首页", path: "/" },
  { icon: Flask, label: "材料智能", path: "/material" },
  { icon: BarChart2, label: "报告", path: "/reports" },
  { icon: Database, label: "数据库", path: "/database" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹窗显示
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登录状态
  const [username, setUsername] = useState("未登录");
  const [inputUsername, setInputUsername] = useState(""); // 用户名输入
  const [inputPassword, setInputPassword] = useState(""); // 密码输入

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLoginClick = () => {
    setIsModalOpen(true); // 打开弹窗
    setIsDropdownOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 关闭弹窗
    setInputUsername("");
    setInputPassword("");
  };

  const handleLoginSubmit = () => {
    if (inputUsername && inputPassword) {
      setIsLoggedIn(true);
      setUsername(inputUsername);
      setIsModalOpen(false); // 关闭弹窗
    } else {
      alert("请输入用户名和密码！");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("未登录");
    setIsDropdownOpen(false);
  };

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : "");

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
            <div className="relative">
              {/* 头像部分 */}
              <button
                onClick={toggleDropdown}
                className="w-8 h-8 rounded-full border-2 border-gray-500 bg-gray-700 flex items-center justify-center text-white font-bold"
              >
                {isLoggedIn ? getInitial(username) : "未"}
              </button>

              {/* 下拉框部分 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10">
                  <div className="px-4 py-2 text-sm text-gray-200">
                    {isLoggedIn ? `欢迎，${username}` : "未登录"}
                  </div>
                  <div className="border-t border-gray-700"></div>
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                    >
                      退出登录
                    </button>
                  ) : (
                    <button
                      onClick={handleLoginClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                    >
                      登录
                    </button>
                  )}
                </div>
              )}
            </div>
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

      {/* 登录弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-gray-800 rounded-lg p-6 w-80">
            <h2 className="text-white text-lg font-semibold mb-4">用户登录</h2>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">用户名</label>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
                placeholder="请输入用户名"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">密码</label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
                placeholder="请输入密码"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                取消
              </button>
              <button
                onClick={handleLoginSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                登录
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
