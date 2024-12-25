"use client";

import { useState } from "react";

interface LoginProps {
  onClose: () => void;
  onLogin: (username: string, companyId: string) => void;
}

export default function Login({ onClose, onLogin }: LoginProps) {
  const [inputUsername, setInputUsername] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("100001"); // 默认选择 Factory_YZ

  const handleLoginSubmit = () => {
    if (inputUsername) {
      onLogin(inputUsername, selectedCompany);
    } else {
      alert("请输入用户名！");
    }
  };

  return (
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
          <label className="block text-gray-400 text-sm mb-2">选择公司</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
          >
            <option value="100002">Factory_YZ</option>
            <option value="100001">Factory_PY</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
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
  );
}
