import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ContentGenerator } from './components/ContentGenerator';
import { ContentAnalyzer } from './components/ContentAnalyzer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ApiStatus, HistoryItem } from './types';
import { Sparkles, ShieldCheck, Heart, Zap, Cpu } from 'lucide-react';

const STORAGE_KEY = 'ai_marketing_assistant_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'analyzer' | 'history'>('generator');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchApiStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setApiStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch API status:', err);
    }
  };

  useEffect(() => {
    fetchApiStatus();
  }, []);

  const handleSaveToHistory = (item: HistoryItem) => {
    setHistoryItems((prev) => {
      const updated = [item, ...prev].slice(0, 50); // Keep latest 50 items
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history to localStorage', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติทั้งหมด?')) {
      setHistoryItems([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-['Prompt',sans-serif] text-slate-800">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        apiStatus={apiStatus}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        historyCount={historyItems.length}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'generator' && (
          <ContentGenerator onSaveToHistory={handleSaveToHistory} />
        )}

        {activeTab === 'analyzer' && (
          <ContentAnalyzer onSaveToHistory={handleSaveToHistory} />
        )}

        {activeTab === 'history' && (
          <HistoryDrawer
            items={historyItems}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">AI Marketing Assistant</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-teal-700">
              <Cpu className="w-3.5 h-3.5" />
              Powered by Google Gemini 3.8 Flash
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              การจัดการ API Key & Secrets
            </button>
            <span>•</span>
            <span className="text-slate-400">ระบบประมวลผลเซิร์ฟเวอร์แบบปลอดภัย</span>
          </div>
        </div>
      </footer>

      {/* API Key Info & Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiStatus={apiStatus}
        onRefreshStatus={fetchApiStatus}
      />
    </div>
  );
}
