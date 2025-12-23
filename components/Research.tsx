
import React, { useState } from 'react';
import { analyzeMarketTrend } from '../services/geminiService';

const Research: React.FC = () => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnalysis('');
    try {
      const result = await analyzeMarketTrend(query);
      setAnalysis(result || '未能生成分析。');
    } catch (err) {
      setAnalysis('分析失败，请检查网络或模型配额。');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    '高性能储能BMS冗余主控单元',
    '工业无人机航电级飞控计算机',
    '基于FPGA的商业卫星地面站射频模块',
    '抗恶劣环境工控网关'
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden border border-slate-700/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              GEMINI 3 PRO STRATEGY ENGINE
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">
              从箭上电子到 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">无限可能</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl leading-relaxed">
              输入任何嵌入式应用领域，我们的战略AI将结合广东智装在高可靠、高集成、抗干扰方面的核心军工航天底座，为您提供“技术降维打击”可行性报告。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-slate-900/50 rounded-3xl border border-slate-700/50">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="探索新市场，例如：高可靠车载智驾主控板..."
                className="flex-1 bg-transparent px-6 py-3 text-lg outline-none text-white placeholder:text-slate-600"
              />
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-black text-white transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '启动调研'}
                {!loading && <span>🚀</span>}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mr-2">战略热点:</span>
              {suggestions.map((s) => (
                <button 
                  key={s} 
                  onClick={() => setQuery(s)}
                  className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-4 py-1.5 rounded-full border border-slate-700/50 transition-all hover:border-blue-500/50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-72 flex flex-col gap-4">
             <div className="glass-panel p-4 rounded-2xl bg-slate-800/20 border-slate-700/30">
                <p className="text-2xl font-black text-blue-500">100%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">技术保密性</p>
             </div>
             <div className="glass-panel p-4 rounded-2xl bg-slate-800/20 border-slate-700/30">
                <p className="text-2xl font-black text-purple-500">TRL 4-7</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">调研成果成熟度</p>
             </div>
             <div className="glass-panel p-4 rounded-2xl bg-slate-800/20 border-slate-700/30">
                <p className="text-2xl font-black text-cyan-500">24/7</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">全球动态监控</p>
             </div>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="glass-panel p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl animate-in slide-in-from-bottom-10 duration-700 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10">
              <span className="text-8xl">📑</span>
           </div>
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-700/50">
            <div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                深度战略市场洞察报告
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Generated by Gemini 3 Pro • {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-2">
                <span>🔗</span> 分享到拓展小组
              </button>
              <button className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-2 rounded-xl text-xs font-black transition-all">
                📥 导出 PDF
              </button>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none prose-indigo">
            <div className="text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
              {analysis}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
