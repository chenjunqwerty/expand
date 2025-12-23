
import React, { useState } from 'react';
import { OrderInfo, OrderStatus } from '../types';

interface OrdersProps {
  orders: OrderInfo[];
  setOrders: React.Dispatch<React.SetStateAction<OrderInfo[]>>;
}

const statusMap: Record<OrderStatus, { label: string, color: string, bg: string, icon: string }> = {
  'NEGOTIATION': { label: '商务洽谈', color: 'border-t-blue-500', bg: 'bg-blue-500/10', icon: '🤝' },
  'SIGNING':     { label: '订单签约', color: 'border-t-indigo-500', bg: 'bg-indigo-500/10', icon: '✍️' },
  'INITIATION':  { label: '产品立项', color: 'border-t-violet-500', bg: 'bg-violet-500/10', icon: '📂' },
  'DESIGN':      { label: '方案设计', color: 'border-t-purple-500', bg: 'bg-purple-500/10', icon: '🎨' },
  'PROTOTYPE':   { label: '原理样机', color: 'border-t-fuchsia-500', bg: 'bg-fuchsia-500/10', icon: '⚙️' },
  'PRODUCTION':  { label: '产品批产', color: 'border-t-pink-500', bg: 'bg-pink-500/10', icon: '🏭' },
  'DELIVERY':    { label: '验收交付', color: 'border-t-emerald-500', bg: 'bg-emerald-500/10', icon: '🚢' },
  'PAYMENT':     { label: '商务回款', color: 'border-t-amber-500', bg: 'bg-amber-500/10', icon: '💰' },
};

const statusOrder: OrderStatus[] = [
  'NEGOTIATION', 'SIGNING', 'INITIATION', 'DESIGN', 
  'PROTOTYPE', 'PRODUCTION', 'DELIVERY', 'PAYMENT'
];

const Orders: React.FC<OrdersProps> = ({ orders, setOrders }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderInfo | null>(null);
  const [newOrder, setNewOrder] = useState<Partial<OrderInfo>>({
    client: '',
    project: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    status: 'NEGOTIATION',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.client || !newOrder.project || !newOrder.value) return;

    const orderToAdd: OrderInfo = {
      id: `ORD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      client: newOrder.client || '',
      project: newOrder.project || '',
      value: newOrder.value || '',
      date: newOrder.date || '',
      status: (newOrder.status as OrderStatus) || 'NEGOTIATION',
      description: newOrder.description || ''
    };

    setOrders(prev => [orderToAdd, ...prev]);
    setIsModalOpen(false);
    setNewOrder({
      client: '',
      project: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
      status: 'NEGOTIATION',
      description: ''
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="p-2.5 bg-emerald-600/20 rounded-2xl text-emerald-500">📈</span>
            外部订单全生命周期追踪
          </h2>
          <p className="text-slate-500 text-sm mt-1">从商务初洽到资金回笼的数智化业务闭环</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-900/40 active:scale-95 flex items-center gap-2"
        >
          <span className="text-xl">+</span> 手动同步新订单
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex gap-6 min-w-max h-full">
          {statusOrder.map((status) => (
            <div key={status} className="w-[320px] flex flex-col">
              <div className={`glass-panel p-4 rounded-2xl border-t-4 ${statusMap[status].color} mb-4 flex flex-col`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="text-sm">{statusMap[status].icon}</span>
                    {statusMap[status].label}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusMap[status].bg} text-slate-300`}>
                    {orders.filter(o => o.status === status).length}
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-current transition-all duration-1000 ${statusMap[status].color.replace('border-t-', 'bg-')}`} 
                    style={{ width: `${((statusOrder.indexOf(status) + 1) / 8) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar min-h-[400px]">
                {orders.filter(o => o.status === status).map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="group glass-panel p-5 rounded-3xl border border-slate-700/30 hover:border-emerald-500/50 hover:bg-emerald-500/[0.03] transition-all cursor-pointer active:scale-[0.98] relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-bold text-sm text-slate-200 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {order.project}
                      </p>
                      <span className="text-[9px] font-mono text-slate-600 shrink-0 ml-2">#{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded-lg bg-slate-800 flex items-center justify-center text-[10px]">🏢</div>
                      <p className="text-[11px] text-slate-500 font-medium truncate">{order.client}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">估值规模</span>
                        <span className="text-sm font-black text-emerald-400 tracking-tight">{order.value}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">更新日期</span>
                        <span className="text-[10px] text-slate-500 font-mono">{order.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {orders.filter(o => o.status === status).length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-slate-800/40 rounded-[2rem] text-slate-700">
                    <div className="text-2xl mb-2 opacity-20">🌫️</div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">暂无项目驻留</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 订单详情模态框 */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-full max-w-2xl glass-panel p-10 rounded-[3rem] border border-emerald-500/20 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <span className="text-[150px] font-black italic">{statusMap[selectedOrder.status].icon}</span>
             </div>
             
             <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest ${statusMap[selectedOrder.status].color.replace('border-t-', 'border-').replace('border-', 'bg-').replace('bg-', 'text-').replace('text-', 'border-')} ${statusMap[selectedOrder.status].bg}`}>
                      {statusMap[selectedOrder.status].label}
                    </span>
                    <h3 className="text-3xl font-black text-white mt-4 leading-tight">{selectedOrder.project}</h3>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 transition-colors">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">合作方/客户</p>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-xl">🏢</div>
                           <p className="text-lg font-bold text-slate-200">{selectedOrder.client}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">订单合同规模</p>
                        <p className="text-3xl font-black text-emerald-400">{selectedOrder.value}</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">系统唯一编号</p>
                        <p className="text-lg font-mono text-slate-400 font-bold">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">最后同步时间</p>
                        <p className="text-lg font-bold text-slate-300 italic">{selectedOrder.date}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">项目进展摘要</p>
                   <p className="text-slate-300 leading-relaxed text-sm">
                      {selectedOrder.description || '该项目目前处于稳步推进中，各阶段关键节点均已在智装研发中心管理系统中备案。暂无异常技术风险提示。'}
                   </p>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-800 flex justify-end gap-4">
                   <button className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all">
                      导出全生命周期报告
                   </button>
                   <button className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-900/30 transition-all">
                      同步研发中心
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 录入模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg glass-panel p-10 rounded-[3rem] border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-emerald-500">📥</span> 同步外部拓展订单
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">客户/单位名称</label>
                <input 
                  autoFocus required type="text" 
                  value={newOrder.client}
                  onChange={e => setNewOrder({...newOrder, client: e.target.value})}
                  placeholder="例如：中国兵器某研究所"
                  className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">项目/产品名称</label>
                <input 
                  required type="text" 
                  value={newOrder.project}
                  onChange={e => setNewOrder({...newOrder, project: e.target.value})}
                  placeholder="例如：某型高可靠性嵌入式主板研制"
                  className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">估值规模</label>
                  <input 
                    required type="text" 
                    value={newOrder.value}
                    onChange={e => setNewOrder({...newOrder, value: e.target.value})}
                    placeholder="240万"
                    className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-emerald-500/50 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">生命周期阶段</label>
                  <select 
                    value={newOrder.status}
                    onChange={e => setNewOrder({...newOrder, status: e.target.value as OrderStatus})}
                    className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-emerald-500/50 outline-none appearance-none"
                  >
                    {statusOrder.map(s => (
                      <option key={s} value={s}>{statusMap[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">项目简介 (选填)</label>
                <textarea 
                  value={newOrder.description}
                  onChange={e => setNewOrder({...newOrder, description: e.target.value})}
                  rows={2}
                  className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:ring-2 ring-emerald-500/50 outline-none resize-none"
                  placeholder="简单描述项目背景..."
                ></textarea>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-bold py-4 rounded-2xl transition-all"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-900/40"
                >
                  确认同步
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
