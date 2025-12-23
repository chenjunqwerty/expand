
import React from 'react';
import { TenderInfo, OrderInfo, ViewType } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

interface DashboardProps {
  tenders: TenderInfo[];
  orders: OrderInfo[];
  onNavigate: (view: ViewType) => void;
}

const trendData = [
  { name: '7月', value: 420 },
  { name: '8月', value: 380 },
  { name: '9月', value: 710 },
  { name: '10月', value: 920 },
  { name: '11月', value: 1100 },
];

const capabilityData = [
  { subject: '可靠性', A: 120, fullMark: 150 },
  { subject: '实时性', A: 98, fullMark: 150 },
  { subject: '集成度', A: 110, fullMark: 150 },
  { subject: '成本控制', A: 40, fullMark: 150 },
  { subject: '开发周期', A: 65, fullMark: 150 },
  { subject: '功耗', A: 130, fullMark: 150 },
];

const Dashboard: React.FC<DashboardProps> = ({ tenders, orders, onNavigate }) => {
  const stats = [
    { label: '活跃招标', count: tenders.filter(t => t.status === 'OPEN').length, icon: '🚀', color: 'text-blue-400', view: ViewType.TENDERS },
    { label: '潜在订单额', count: '¥8.4M', icon: '💎', color: 'text-cyan-400', view: ViewType.ORDERS },
    { label: '调研深度', count: 'A+', icon: '🧬', color: 'text-purple-400', view: ViewType.RESEARCH },
    { label: '市场占有预估', count: '2.4%', icon: '🌏', color: 'text-emerald-400', view: ViewType.DASHBOARD },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(stat.view)}
            className="glass-panel p-6 rounded-3xl group hover:bg-blue-600/10 transition-all duration-300 relative overflow-hidden text-left active:scale-[0.98] border-transparent hover:border-blue-500/30"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-all">
               <span className="text-6xl">{stat.icon}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl p-2 bg-slate-800/50 rounded-lg group-hover:bg-blue-600/20 transition-colors">{stat.icon}</span>
              <div className="flex flex-col items-end">
                <span className={`text-2xl font-black ${stat.color}`}>{stat.count}</span>
                <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">点击查看详情 →</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
              市场机会规模趋势 (百万)
            </h3>
            <select className="bg-slate-800 text-xs border-none rounded-lg px-3 py-1 text-slate-400 focus:ring-1 ring-blue-500">
              <option>近半年</option>
              <option>近一年</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capability Radar Chart */}
        <div className="glass-panel p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
            核心技术适配度
          </h3>
          <div className="h-[320px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={capabilityData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="none" />
                <Radar
                  name="核心能力"
                  dataKey="A"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
             <h4 className="font-bold text-slate-300">活跃中的高价值项目</h4>
             <button 
              onClick={() => onNavigate(ViewType.TENDERS)}
              className="text-blue-400 text-xs hover:underline bg-transparent border-none outline-none font-bold"
             >
               查看全部 →
             </button>
          </div>
          <div className="space-y-3">
             {tenders.filter(t => t.status === 'OPEN').slice(0,3).map(t => (
               <div 
                key={t.id} 
                onClick={() => onNavigate(ViewType.TENDERS)}
                className="flex items-center justify-between p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer group"
               >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-semibold truncate text-slate-200 group-hover:text-blue-400 transition-colors">{t.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Budget: {t.budget}</p>
                  </div>
                  <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black italic group-hover:bg-blue-600 group-hover:text-white transition-all">
                    DETAILS
                  </div>
               </div>
             ))}
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
             <h4 className="font-bold text-slate-300">近期调研结论摘要</h4>
             <button 
              onClick={() => onNavigate(ViewType.RESEARCH)}
              className="text-purple-400 text-xs hover:underline bg-transparent border-none outline-none font-bold"
             >
               进入实验室 →
             </button>
          </div>
          <div 
            onClick={() => onNavigate(ViewType.RESEARCH)}
            className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 hover:border-indigo-400 cursor-pointer transition-all group"
          >
             <p className="text-xs text-indigo-300 leading-relaxed font-medium italic group-hover:text-white transition-colors">
               "当前民用BMS市场对于ASIL-D等级的控制器需求激增，我司在火箭电池管理系统的冗余设计积累可直接降维应用于储能领域，预计缩短研发周期30%..."
             </p>
             <div className="mt-2 text-[10px] text-indigo-500 font-bold uppercase tracking-widest text-right">查看详细报告 ⇢</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
