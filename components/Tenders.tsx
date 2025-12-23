
import React, { useState } from 'react';
import { TenderInfo } from '../types';
import { summarizeTender, searchOnlineTenders } from '../services/geminiService';

interface TendersProps {
  tenders: TenderInfo[];
  setTenders: React.Dispatch<React.SetStateAction<TenderInfo[]>>;
}

const Tenders: React.FC<TendersProps> = ({ tenders, setTenders }) => {
  const [selectedTender, setSelectedTender] = useState<TenderInfo | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ text: string, sources: any[] } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTender, setNewTender] = useState<Partial<TenderInfo>>({
    title: '',
    source: '人工录入',
    budget: '',
    deadline: '',
    tags: ['嵌入式'],
    status: 'OPEN'
  });

  const openDetail = async (tender: TenderInfo) => {
    setSelectedTender(tender);
    setDetailModalOpen(true);
    setLoading(true);
    setSummary('');
    setSearchResult(null);
    try {
      const text = await summarizeTender(`项目名称：${tender.title}，来源：${tender.source}，预算：${tender.budget}，标签：${tender.tags.join(',')}`);
      setSummary(text || '未能生成深度分析。');
    } catch (err) {
      setSummary('AI分析服务暂时忙碌，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOnline = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setSelectedTender(null);
    setSummary('');
    try {
      const result = await searchOnlineTenders(searchQuery);
      setSearchResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTender.title || !newTender.budget) return;

    const tenderToAdd: TenderInfo = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTender.title || '',
      source: newTender.source || '人工录入',
      budget: newTender.budget || '',
      deadline: newTender.deadline || new Date().toISOString().split('T')[0],
      tags: newTender.tags || ['嵌入式'],
      status: 'OPEN'
    };

    setTenders(prev => [tenderToAdd, ...prev]);
    setIsModalOpen(false);
    setNewTender({ title: '', source: '人工录入', budget: '', deadline: '', tags: ['嵌入式'], status: 'OPEN' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="p-2 bg-blue-600/20 rounded-xl">📢</span>
            招标信息动态同步
          </h2>
          <p className="text-slate-400 text-sm mt-1">集成内网同步与全网AI信息穿透，捕捉每一个技术拓展点</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <input 
              type="text" 
              placeholder="AI 搜索全网招标机会..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-blue-500 outline-none"
             />
             <button onClick={handleSearchOnline} className="absolute right-2 top-1.5 p-1 text-slate-400 hover:text-blue-400">🔍</button>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap">
            + 录入新信息
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800/50 shadow-xl">
          <div className="p-4 bg-slate-800/20 border-b border-slate-700/50 font-bold text-xs uppercase tracking-widest text-slate-500 flex justify-between">
            <span>实时同步池</span>
            <span className="text-blue-400">{tenders.length} 项目在库</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/30 text-slate-400 font-bold border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-4">招标项目背景</th>
                  <th className="px-6 py-4">发布渠道</th>
                  <th className="px-6 py-4">预算规模</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {tenders.map((tender) => (
                  <tr key={tender.id} onClick={() => openDetail(tender)} className="hover:bg-blue-500/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{tender.title}</p>
                      <div className="flex gap-2 mt-1.5">
                        {tender.tags.map(tag => <span key={tag} className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">#{tag}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{tender.source}</td>
                    <td className="px-6 py-4 text-emerald-400 font-black tracking-tight">{tender.budget}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black ${tender.status === 'OPEN' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                        {tender.status === 'OPEN' ? '正在公示' : '已截止'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="text-blue-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">查看详情 →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 招标项目详情模态框 */}
      {detailModalOpen && selectedTender && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setDetailModalOpen(false)}></div>
          <div className="relative w-full max-w-3xl glass-panel p-10 rounded-[3rem] border border-blue-500/20 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <span className="text-[120px] font-black italic">TENDER</span>
             </div>
             
             <div className="relative z-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                      ID: {selectedTender.id}
                    </span>
                    <h3 className="text-3xl font-black text-white mt-4 leading-tight pr-10">{selectedTender.title}</h3>
                  </div>
                  <button onClick={() => setDetailModalOpen(false)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 transition-colors">✕</button>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-10">
                   <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">预算金额</p>
                      <p className="text-2xl font-black text-emerald-400">{selectedTender.budget}</p>
                   </div>
                   <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">发布来源</p>
                      <p className="text-sm font-bold text-slate-200 truncate">{selectedTender.source}</p>
                   </div>
                   <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">投标截止</p>
                      <p className="text-sm font-bold text-slate-200 italic">{selectedTender.deadline}</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-indigo-500/5 p-8 rounded-[2rem] border border-indigo-500/20">
                      <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="animate-pulse">✨</span> AI 情报深度解析
                      </h4>
                      {loading ? (
                        <div className="flex flex-col items-center py-10 space-y-4">
                           <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                           <p className="text-xs text-indigo-300 font-bold animate-pulse uppercase tracking-widest">正在穿透核心竞争力契合点...</p>
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                           {summary}
                        </div>
                      )}
                   </div>
                   
                   <div className="flex gap-2">
                      {selectedTender.tags.map(tag => (
                        <span key={tag} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-500 italic">#{tag}</span>
                      ))}
                   </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-800 flex justify-end gap-4 sticky bottom-0 bg-[#0f172a] pb-2">
                   <button className="px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all">
                      导出研讨报告
                   </button>
                   <button className="px-10 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-900/30 transition-all">
                      跟进此项目
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 手动录入模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg glass-panel p-10 rounded-[3rem] border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <span className="text-blue-500">➕</span> 录入外部招标项目
            </h3>
            <form onSubmit={handleSubmitNewTender} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">项目标题</label>
                <input autoFocus required type="text" value={newTender.title} onChange={e => setNewTender({...newTender, title: e.target.value})} placeholder="例如：某型嵌入式主控系统招标" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 ring-blue-500 outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">预算规模</label>
                  <input required type="text" value={newTender.budget} onChange={e => setNewTender({...newTender, budget: e.target.value})} placeholder="200万" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 ring-blue-500 outline-none"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">截止日期</label>
                  <input required type="date" value={newTender.deadline} onChange={e => setNewTender({...newTender, deadline: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 ring-blue-500 outline-none"/>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all">取消</button>
                <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40">确认同步</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenders;
