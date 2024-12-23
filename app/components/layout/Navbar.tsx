"use client";

import {
  Home,
  BarChart2,
  Database,
  FlaskRoundIcon as Flask,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "../../context/userContext";
import Login from "../../login/login";

const navItems = [
  { icon: Home, label: "首页", path: "/" },
  { icon: Flask, label: "材料智能", path: "/material" },
  { icon: BarChart2, label: "报告", path: "/reports" },
  { icon: Database, label: "数据库", path: "/database" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLoginSuccess = (username: string, companyId: string) => {
    console.log(`User ${username} logged in with Company ID: ${companyId}`);
    setUser({ username, companyId });
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    console.log(`User ${user?.username} logged out.`);
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/"); // Redirect to the homepage
  };

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "";

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">EcoMatrix</span>
            <span className="ml-4 text-gray-400">
              /{" "}
              {user?.companyId === "100001"
                ? "Factory_YZ"
                : user?.companyId === "100002"
                ? "Factory_PY"
                : "未选择公司"}
              /
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              更新日志
            </button>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-8 h-8 rounded-full border-2 border-gray-500 bg-gray-700 flex items-center justify-center text-white font-bold"
              >
                {user ? getInitial(user.username) : "未"}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10">
                  <div className="px-4 py-2 text-sm text-gray-200">
                    {user ? `欢迎，${user.username}` : "未登录"}
                  </div>
                  <div className="border-t border-gray-700"></div>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                    >
                      退出登录
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsModalOpen(true)}
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
              href={user ? item.path : "#"} // Disable navigation if not logged in
              className={`flex items-center space-x-2 py-4 border-b-2 ${
                pathname === item.path
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              } transition-colors ${!user && "pointer-events-none opacity-50"}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <Login
          onClose={() => setIsModalOpen(false)}
          onLogin={handleLoginSuccess}
        />
      )}
    </nav>
  );
}
