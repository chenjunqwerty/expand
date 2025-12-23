import { GoogleGenAI } from "@google/genai";

export const searchOnlineTenders = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `请搜索并列出最近关于 '${query}' 的外部招标信息。请包含项目名称、发布日期、预算范围（如有）和原始链接。重点关注嵌入式系统、工业控制和高可靠性电子产品。`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  const text = response.text;
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return { text, sources };
};

export const analyzeMarketTrend = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `作为一名嵌入式软硬件战略专家，请针对以下市场方向进行深度调研：'${topic}'。
    你需要结合‘星际荣耀’（高可靠、航天级、高度集成、多协议总线）的技术背景，分析：
    1. 目标市场的技术准入门槛。
    2. 箭上电子技术向此领域迁移的优势与难点。
    3. 关键供应商与竞争格局。
    4. 具体的‘技术降维’策略建议。
    请按专业调研报告格式输出。`,
    config: {
      temperature: 1,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};

export const summarizeTender = async (tenderContent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `请深度解析以下招标信息，识别隐藏的技术风险点和星际荣耀核心竞争力契合点：'${tenderContent}'`,
  });
  return response.text;
};