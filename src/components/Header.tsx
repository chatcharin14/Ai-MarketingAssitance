import React from 'react';
import { Sparkles, ShieldCheck, History, PenTool, BarChart3, KeyRound } from 'lucide-react';
import { ApiStatus } from '../types';

interface HeaderProps {
  activeTab: 'generator' | 'analyzer' | 'history';
  onTabChange: (tab: 'generator' | 'analyzer' | 'history') => void;
  apiStatus: ApiStatus | null;
  onOpenApiKeyModal: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  apiStatus,
  onOpenApiKeyModal,
  historyCount,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  AI Marketing Assistant
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-teal-50 text-teal-700 rounded-md border border-teal-200/60 uppercase tracking-wider">
                  v2.0 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ผู้ช่วยสร้างและวิเคราะห์คอนเทนต์การตลาดอัจฉริยะ ขับเคลื่อนด้วย Gemini 3.8
              </p>
            </div>
          </div>

          {/* Right Actions: API Key status badge & History */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* API Key Status Pill */}
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer bg-slate-50 hover:bg-teal-50/70 border-slate-200 hover:border-teal-300 text-slate-700"
              title="ดูข้อมูล API Key และการเชื่อมต่อ Gemini"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    apiStatus?.hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <KeyRound className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <span className="hidden md:inline font-mono text-[11px] font-semibold text-teal-800">
                {apiStatus?.model || 'gemini-3.8-flash'}
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-600 text-[11px]">
                {apiStatus?.hasApiKey ? 'API พร้อมใช้' : 'เช็คสถานะ Key'}
              </span>
            </button>

            {/* History Pill */}
            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
              title="คลังประวัติคอนเทนต์"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ประวัติ</span>
              {historyCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'history'
                      ? 'bg-teal-700 text-white'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-transparent pb-3 pt-1">
          <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-2xl w-full sm:max-w-md mx-auto shadow-inner">
            <button
              onClick={() => onTabChange('generator')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-white text-teal-800 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <PenTool className="w-4 h-4 text-teal-600" />
              สร้างคอนเทนต์ (Generator)
            </button>

            <button
              onClick={() => onTabChange('analyzer')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-white text-blue-800 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              วิเคราะห์คอนเทนต์ (Analyzer)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
