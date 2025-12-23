import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 账号验证：5位数字
    if (!/^\d{5}$/.test(account)) {
      setError('请输入有效的5位数字终端账号');
      return;
    }

    // 密码验证：gdxj (已由 xjzh 修改为 gdxj)
    if (password !== 'gdxj') {
      setError('安全校验未通过，请检查接入密码');
      return;
    }

    setLoading(true);
    // 模拟加密核验过程
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      {/* 动态科技背景装饰 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="glass-panel p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-3xl">
          {/* 品牌头部 */}
          <div className="text-center mb-10">
            <div className="text-4xl font-black tracking-tighter text-white flex justify-center items-center gap-1 mb-2">
              <span className="text-blue-500 text-5xl">i</span>SPACE
            </div>
            <div className="h-0.5 w-12 bg-blue-600 mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-bold tracking-[0.4em] uppercase">
              市场拓展数智平台
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">
                终端账号 (5位数字)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">ID</span>
                <input
                  type="text"
                  maxLength={5}
                  value={account}
                  onChange={(e) => setAccount(e.target.value.replace(/\D/g, ''))}
                  placeholder="00000"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-800 font-mono text-lg tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">
                接入密码
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Key</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-800 font-mono text-lg"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] py-3 px-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center text-sm tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "身份验证与接入"
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-800 pt-6">
            <p className="text-[9px] text-slate-600 font-medium leading-loose uppercase tracking-[0.2em]">
              广东星际荣耀智慧装备有限责任公司<br/>研发中心 • 内部专用终端
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;