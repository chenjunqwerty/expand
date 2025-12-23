
import React, { useState, useEffect } from 'react';
import { ViewType, TenderInfo, OrderInfo, FeedbackItem } from './types';
import Dashboard from './components/Dashboard';
import Tenders from './components/Tenders';
import Orders from './components/Orders';
import Research from './components/Research';
import Innovation from './components/Innovation';
import AIChat from './components/AIChat';
import Feedback from './components/Feedback';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';

const App: React.FC = () => {
  // 从 localStorage 获取登录状态，实现页面刷新后依然保持登录（可选，此处先默认 false 确保退出功能生效）
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ispace_auth') === 'true';
  });
  
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  
  const [tenders, setTenders] = useState<TenderInfo[]>([
    { id: 'T1', title: '某型工业无人机飞控系统软硬件开发招标', source: '中国招标投标公共服务平台', budget: '280万', deadline: '2024-11-20', tags: ['无人机', '飞控', '嵌入式'], status: 'OPEN' },
    { id: 'T2', title: '商用卫星地面测控组件采购', source: '军队采购网', budget: '150万', deadline: '2024-12-05', tags: ['测控', 'FPGA'], status: 'OPEN' },
    { id: 'T3', title: '高可靠性车载控制单元主板研制', source: '某车企私有云', budget: '500万', deadline: '2024-10-15', tags: ['汽车电子', 'ASIL-D'], status: 'CLOSED' },
    { id: 'T4', title: '深海探测机器人控制系统招标', source: '海洋局招标门户', budget: '420万', deadline: '2024-11-30', tags: ['深海', '高可靠'], status: 'OPEN' },
    { id: 'T5', title: '智慧电网配电站监控终端研制', source: '国网采购平台', budget: '180万', deadline: '2024-12-10', tags: ['电网', '嵌入式'], status: 'OPEN' },
  ]);

  const [orders, setOrders] = useState<OrderInfo[]>([
    { id: 'O1', client: '科创能源有限公司', project: 'BMS电池管理系统核心板', value: '120万', date: '2024-09-12', status: 'INITIATION', description: '基于箭上BMS冗余架构开发的民用储能系统主控板。目前已完成技术路线对齐，进入立项评审阶段。' },
    { id: 'O2', client: '蓝天航空', project: '传感器信号调理模块', value: '45万', date: '2024-10-01', status: 'NEGOTIATION', description: '客户对我们的抗辐照调理芯片非常感兴趣，正在讨论在低轨民用飞行器上的适配性。' },
    { id: 'O3', client: '先锋智能', project: '多协议通信网关', value: '88万', date: '2024-10-10', status: 'PROTOTYPE', description: '样机已通过初步通讯联试，正在进行高低温环境模拟测试。' },
    { id: 'O4', client: '中核装备', project: '抗辐照控制计算机', value: '350万', date: '2024-08-15', status: 'PRODUCTION', description: '关键物料已全部到齐，正在进行首批生产线的SMT贴片工作。' },
    { id: 'O5', client: '东方精工', project: '嵌入式冗余控制器', value: '210万', date: '2024-10-25', status: 'SIGNING', description: '合同商务条款已达成一致，进入法务审核和电子盖章流程。' },
    { id: 'O6', client: '极地物流', project: '低温环境飞控计算机', value: '180万', date: '2024-10-20', status: 'DESIGN', description: '正在进行宽温域电路优化，利用我们箭上极端环境热管理经验进行设计降维。' },
    { id: 'O7', client: '华南农机', project: '无人植保机视觉导航盒', value: '65万', date: '2024-09-30', status: 'DELIVERY', description: '产品已运抵客户试验场，正在配合客户进行真机挂载和农业场景联调。' },
    { id: 'O8', client: '深海探测', project: '耐压密封电子舱控制板', value: '240万', date: '2024-07-20', status: 'PAYMENT', description: '项目已顺利通过验收交付，客户反馈良好，目前正在进行最后一笔进度款的回笼。' },
    { id: 'O9', client: '通用动力', project: '工业级高速总线扩展卡', value: '55万', date: '2024-11-02', status: 'NEGOTIATION', description: '初步技术交流阶段，主要评估我们1553B转TSN网络的技术可行性。' },
    { id: 'O10', client: '雷霆防御', project: '加固型嵌入式显示单元', value: '420万', date: '2024-10-12', status: 'PROTOTYPE', description: '结构样机已交付客户，正在反馈按键手感和强光下显示效果。' },
    { id: 'O11', client: '智慧交通', project: '城市路口视觉处理终端', value: '135万', date: '2024-10-28', status: 'SIGNING', description: '意向书已签，正在起草正式的技术开发服务合同。' },
    { id: 'O12', client: '未来矿山', project: '井下定位冗余网关', value: '290万', date: '2024-11-05', status: 'DESIGN', description: '重点攻关本安型防爆设计，将卫星测控链路中的抗多径算法引入井下定位。' },
  ]);

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('ispace_feedbacks');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', content: '建议在订单追踪中增加合同附件预览功能。', category: 'SUGGESTION', author: '智装工程师A', timestamp: '2024-11-10 14:30' },
      { id: 'f2', content: 'AI 搜索在窄带宽环境下响应稍慢，建议优化。', category: 'UI', author: '拓展部经理', timestamp: '2024-11-12 09:15' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ispace_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ispace_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ispace_auth');
    // 退出后重置视图到概览，以便下次进入显示正确
    setCurrentView(ViewType.DASHBOARD);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <Dashboard tenders={tenders} orders={orders} onNavigate={setCurrentView} />;
      case ViewType.TENDERS:
        return <Tenders tenders={tenders} setTenders={setTenders} />;
      case ViewType.ORDERS:
        return <Orders orders={orders} setOrders={setOrders} />;
      case ViewType.INNOVATION:
        return <Innovation />;
      case ViewType.RESEARCH:
        return <Research />;
      case ViewType.AI_CHAT:
        return <AIChat />;
      case ViewType.FEEDBACK:
        return <Feedback feedbacks={feedbacks} setFeedbacks={setFeedbacks} />;
      default:
        return <Dashboard tenders={tenders} orders={orders} onNavigate={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden animate-in fade-in duration-500">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
