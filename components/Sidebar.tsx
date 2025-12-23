
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { type: ViewType.DASHBOARD, label: '概览总览', icon: '📊' },
    { type: ViewType.TENDERS, label: '招标动态', icon: '📢' },
    { type: ViewType.ORDERS, label: '订单追踪', icon: '📝' },
    { type: ViewType.INNOVATION, label: '创新引领', icon: '💡' },
    { type: ViewType.RESEARCH, label: '产品调研', icon: '🔬' },
    { type: ViewType.AI_CHAT, label: '拓展助手', icon: '🤖' },
    { type: ViewType.FEEDBACK, label: '体验反馈', icon: '💬' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-700/50 flex flex-col h-full z-20">
      <div className="p-6">
        <div className="mb-10 flex flex-col items-center">
          <div className="text-3xl font-black tracking-tighter text-white flex items-center gap-1">
            <span className="text-blue-500 text-4xl">i</span>SPACE
          </div>
          <div className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">
            星际荣耀智慧装备
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.type}
              onClick={() => setCurrentView(item.type)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                currentView === item.type
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <p className="text-[9px] text-slate-500 font-bold uppercase mb-2 tracking-widest">系统连接状态</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-slate-300 font-bold">双向加密链路已开启</span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
        >
          <span className="text-lg group-hover:rotate-12 transition-transform">🔌</span>
          <span className="font-bold text-xs uppercase tracking-widest">退出系统</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
