
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  TENDERS = 'TENDERS',
  ORDERS = 'ORDERS',
  RESEARCH = 'RESEARCH',
  INNOVATION = 'INNOVATION',
  AI_CHAT = 'AI_CHAT',
  FEEDBACK = 'FEEDBACK'
}

export interface TenderInfo {
  id: string;
  title: string;
  source: string;
  budget: string;
  deadline: string;
  tags: string[];
  status: 'OPEN' | 'CLOSED' | 'PENDING';
}

export type OrderStatus = 
  | 'NEGOTIATION' // 商务洽谈
  | 'SIGNING'     // 订单签约
  | 'INITIATION'  // 产品立项
  | 'DESIGN'      // 方案设计
  | 'PROTOTYPE'   // 原理样机
  | 'PRODUCTION'  // 产品批产
  | 'DELIVERY'    // 验收交付
  | 'PAYMENT';    // 商务回款

export interface OrderInfo {
  id: string;
  client: string;
  project: string;
  value: string;
  date: string;
  status: OrderStatus;
  description?: string;
}

export interface RDProject {
  id: string;
  title: string;
  category: string;
  phase: 'CONCEPT' | 'DEVELOPING' | 'PROTOTYPE' | 'TESTING';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface FeedbackItem {
  id: string;
  content: string;
  category: 'BUG' | 'SUGGESTION' | 'UI' | 'OTHER';
  timestamp: string;
  author: string;
}
