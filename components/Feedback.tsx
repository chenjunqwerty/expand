
import React, { useState } from 'react';
import { FeedbackItem } from '../types';

interface FeedbackProps {
  feedbacks: FeedbackItem[];
  setFeedbacks: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
}

const Feedback: React.FC<FeedbackProps> = ({ feedbacks, setFeedbacks }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<FeedbackItem['category']>('SUGGESTION');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    // 模拟提交过程
    setTimeout(() => {
      const newFeedback: FeedbackItem = {
        id: `F-${Date.now()}`,
        content,
        category,
        author: '当前用户',
        timestamp: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      };

      setFeedbacks(prev => [newFeedback, ...prev]);
      setContent('');
      setIsSubmitting(false);
    }, 600);
  };

  const catMap: Record<FeedbackItem['category'], { label: string, color: string }> = {
    'BUG': { label: '缺陷报告', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    'SUGGESTION': { label: '功能建议', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    'UI': { label: '界面优化', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    'OTHER': { label: '其他', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600/20 rounded-2xl text-indigo-500">💬</span>
            平台体验反馈
          </h2>
          <p className="text-slate-400 text-sm mt-2">您的每一条建议都是我们迭代“智装”系统的核心动力</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 反馈表单 */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-8 rounded-[2.5rem] border-slate-700/30 sticky top-0">
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span className="text-indigo-500">✍️</span> 撰写反馈意见
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">反馈类别</label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(catMap) as Array<FeedbackItem['category']>).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                        category === cat 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40 scale-[1.02]' 
                          : 'bg-slate-900/50 border-slate-700/50 text-slate-500 hover:border-indigo-500/30'
                      }`}
                    >
                      {catMap[cat].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">反馈内容</label>
                <textarea
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={6}
                  placeholder="请详细描述您的使用痛点或改进建议..."
                  className="w-full bg-slate-900/80 border border-slate-700/50 rounded-3xl px-6 py-4 text-white focus:ring-2 ring-indigo-500 outline-none resize-none transition-all placeholder:text-slate-700"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>提交并存档反馈 <span className="text-lg">💾</span></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 历史反馈 */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-slate-300">历史反馈记录</h3>
            <span className="text-[10px] font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-500 border border-slate-700/50">
              TOTAL: {feedbacks.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {feedbacks.length === 0 ? (
              <div className="py-32 text-center glass-panel rounded-[2.5rem] border-dashed border-slate-800 opacity-40">
                <span className="text-6xl block mb-4">📭</span>
                <p className="text-sm font-bold uppercase tracking-widest">目前还没有收到任何反馈</p>
              </div>
            ) : (
              feedbacks.map(f => (
                <div key={f.id} className="glass-panel p-6 rounded-[2rem] border-slate-700/30 hover:border-indigo-500/20 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${catMap[f.category].color}`}>
                      {catMap[f.category].label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">{f.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 pl-1">
                    {f.content}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-[8px] font-bold">U</div>
                      <span className="text-[10px] text-slate-500 font-bold">{f.author}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-indigo-400 font-bold">已同步至研发中心</span>
                      <span className="text-indigo-500">✅</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
