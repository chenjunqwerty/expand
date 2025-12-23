
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 glass-panel border-b border-slate-700/50 flex items-center justify-between px-6 z-10">
      <div className="flex items-center space-x-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          Research & Development Center
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-slate-300">AI服务运行中</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
          ADMIN
        </div>
      </div>
    </header>
  );
};

export default Header;
