
import React, { useState } from 'react';
import { RDProject } from '../types';
import { GoogleGenAI } from "@google/genai";

const Innovation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [techQuery, setTechQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<RDProject | null>(null);
  
  const [projects, setProjects] = useState<RDProject[]>([
    { id: 'RD-001', title: '高带宽抗辐照总线控制芯片', category: '芯片开发', phase: 'DEVELOPING', priority: 'HIGH', description: '基于箭上1553B总线协议，适配民用卫星组网需求。目前已完成FPGA软核验证。' },
    { id: 'RD-002', title: '低功耗边缘侧视觉AI处理单元', category: '嵌入式软件', phase: 'CONCEPT', priority: 'MEDIUM', description: '将箭上图像识别算法优化，应用于工业无人机自动避障。处于轻量化神经网络剪枝研究阶段。' },
    { id: 'RD-003', title: '三级冗余BMS主控板样机', category: '硬件架构', phase: 'PROTOTYPE', priority: 'HIGH', description: '引入航天级冗余校验机制，提升储能电站控制可靠性。物理样机已完成三防漆涂覆。' },
  ]);

  const [newProject, setNewProject] = useState<Partial<RDProject>>({
    title: '',
    category: '技术研究',
    phase: 'CONCEPT',
    priority: 'MEDIUM',
    description: ''
  });

  const handleGeneratePath = async () => {
    if (!techQuery.trim()) return;
    setLoading(true);
    setAiResponse('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `针对新技术 '${techQuery}'，请从广东智装（星际荣耀）的研发视角，提供一份详细的研发路径规划。`,
        config: { temperature: 0.8, thinkingConfig: { thinkingBudget: 16000 } }
      });
      setAiResponse(response.text || '生成失败');
    } catch (err) {
      setAiResponse('AI 响应异常，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    const project: RDProject = {
      id: `RD-${Math.floor(100 + Math.random() * 900)}`,
      title: newProject.title || '',
      category: newProject.category || '未分类',
      phase: newProject.phase as any || 'CONCEPT',
      priority: newProject.priority as any || 'MEDIUM',
      description: newProject.description || '',
    };
    setProjects(prev => [project, ...prev]);
    setIsModalOpen(false);
    setNewProject({ title: '', category: '技术研究', phase: 'CONCEPT', priority: 'MEDIUM', description: '' });
  };

  const phaseColors: Record<string, string> = {
    'CONCEPT': 'bg-slate-800 text-slate-400 border-slate-700',
    'DEVELOPING': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'PROTOTYPE': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'TESTING': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-cyan-600/20 rounded-2xl text-cyan-500">💡</span>
            创新引领中心
          </h2>
          <p className="text-slate-400 text-sm mt-2">驱动箭上电子技术向民用市场“降维打击”的核心枢纽</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl shadow-cyan-900/20 active:scale-95">
          ➕ 发起新课题
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-cyan-500/10 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
            <span className="animate-pulse text-lg">✨</span> AI 研发路径规划器
          </h3>
          <div className="flex gap-4 mb-8">
            <input type="text" value={techQuery} onChange={e => setTechQuery(e.target.value)} placeholder="输入前沿技术，如：GaN 高频驱动器..." className="flex-1 bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:ring-2 ring-cyan-500 outline-none"/>
            <button onClick={handleGeneratePath} disabled={loading} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-cyan-900/30 disabled:opacity-50 transition-all">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '推演'}
            </button>
          </div>
          <div className={`min-h-[300px] p-6 bg-slate-900/30 border border-slate-800 rounded-3xl overflow-y-auto ${!aiResponse && 'flex items-center justify-center'}`}>
            {aiResponse ? <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">{aiResponse}</div> : <div className="text-center opacity-40"><span className="text-5xl block">🧪</span><p className="text-xs mt-2 uppercase tracking-widest font-bold">等待推演指令...</p></div>}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col h-[540px]">
          <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
            <span>正在进行的课题</span>
            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-500">{projects.length}</span>
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {projects.map(p => (
              <div key={p.id} onClick={() => setSelectedProject(p)} className="group p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${phaseColors[p.phase]}`}>{p.phase}</span>
                   {p.priority === 'HIGH' && <span className="text-rose-500 animate-pulse text-xs">🔥</span>}
                </div>
                <h4 className="font-bold text-slate-200 mb-1.5 group-hover:text-cyan-400 transition-colors">{p.title}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 研发项目详情模态框 */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedProject(null)}></div>
          <div className="relative w-full max-w-2xl glass-panel p-10 rounded-[3rem] border border-cyan-500/20 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex items-start justify-between mb-8">
                <div>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${phaseColors[selectedProject.phase]}`}>
                     {selectedProject.phase}
                   </span>
                   <h3 className="text-3xl font-black text-white mt-4">{selectedProject.title}</h3>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 transition-colors">✕</button>
             </div>
             <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">课题编号</p>
                   <p className="text-lg font-mono text-slate-300 font-bold">{selectedProject.id}</p>
                </div>
                <div>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">技术分类</p>
                   <p className="text-lg font-bold text-slate-300">{selectedProject.category}</p>
                </div>
             </div>
             <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 mb-8">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-3">课题研究摘要</p>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedProject.description}</p>
             </div>
             <div className="flex justify-end gap-4">
                <button className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs transition-all">下载技术文档</button>
                <button className="px-8 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-xl shadow-cyan-900/30 transition-all">查看研发进度表</button>
             </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl glass-panel p-10 rounded-[3rem] border border-cyan-500/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><span className="text-cyan-500">🧪</span> 发起研发新项目</h3>
            <form onSubmit={handleAddProject} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">项目标题</label>
                <input autoFocus required type="text" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} placeholder="例如：箭上1553B总线民用转码芯片" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-cyan-500 outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">所属分类</label>
                  <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-cyan-500 outline-none"><option>芯片开发</option><option>嵌入式软件</option><option>硬件架构</option></select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">研发阶段</label>
                  <select value={newProject.phase} onChange={e => setNewProject({...newProject, phase: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-cyan-500 outline-none"><option value="CONCEPT">概念预研</option><option value="DEVELOPING">方案开发</option><option value="PROTOTYPE">工程样机</option></select>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-4 rounded-2xl transition-all">取消</button>
                <button type="submit" className="flex-[2] bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-cyan-900/40">下达任务</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Innovation;
