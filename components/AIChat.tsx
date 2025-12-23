import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createAudioBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '您好！我是星际荣耀拓展小组 AI 助手。我已经加载了箭上综合电子产品的技术底座，准备好协助您进行民用/商用市场的降维打击调研。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const stopLiveSession = () => {
    setIsLive(false);
    sessionRef.current = null;
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const startLiveSession = async () => {
    if (isLive) {
      stopLiveSession();
      return;
    }

    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setLoading(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createAudioBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Error:", e);
            stopLiveSession();
          },
          onclose: () => {
            stopLiveSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: '你是一个星际荣耀公司的市场拓展战略专家。请协助研发中心同事进行嵌入式软硬件市场调研。语气要专业、干练。',
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("无法启动语音会话。");
    }
  };

  const handleTextSend = async () => {
    if (!input.trim() || loading || isLive) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: '你是一个星际荣耀公司的市场拓展专家。协助研发中心同事分析外部订单与招标。',
        }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || '暂无回应' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '服务暂时不可用。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col glass-panel rounded-3xl overflow-hidden relative shadow-2xl">
      {isLive && (
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="w-32 h-32 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                 <span className="text-3xl">🎙️</span>
              </div>
           </div>
           <h3 className="text-2xl font-black text-white mt-8 tracking-widest uppercase">战略对讲模式</h3>
           <button 
            onClick={stopLiveSession}
            className="mt-12 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-all"
           >
             断开连接
           </button>
        </div>
      )}

      <div className="p-4 border-b border-slate-700/50 bg-slate-800/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="font-bold">星际荣耀战略决策助手</span>
        </div>
        <span className="text-xs text-slate-500">iSPACE Intelligence Engine</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800/80 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && !isLive && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex space-x-2">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
        <div className="flex space-x-3">
          <input 
            type="text"
            value={input}
            disabled={isLive}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSend()}
            placeholder="输入战略咨询需求..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          />
          <button 
            onClick={startLiveSession}
            className={`p-4 rounded-2xl transition-all ${isLive ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'} border border-slate-700`}
          >
            <span className="text-xl">{isLive ? '⏹️' : '🎙️'}</span>
          </button>
          <button 
            onClick={handleTextSend}
            disabled={loading || isLive || !input.trim()}
            className="bg-blue-600 px-6 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;