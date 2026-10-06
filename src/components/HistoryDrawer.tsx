import React, { useState } from 'react';
import { History, Trash2, Copy, Check, PenTool, BarChart3, Search, Clock, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types';
import { MarkdownView } from './MarkdownView';

interface HistoryDrawerProps {
  items: HistoryItem[];
  onClearHistory: () => void;
  onSelectItem?: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  items,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'generator' | 'analyzer'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('th-TH', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            คลังประวัติคอนเทนต์ที่เคยสร้าง & วิเคราะห์
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกไว้ในเบราว์เซอร์ของคุณโดยอัตโนมัติ ไม่ต้องกังวลว่าไอเดียจะสูญหาย
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> ล้างประวัติทั้งหมด
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามชื่อสินค้า, แพลตฟอร์ม หรือข้อความ..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              filterType === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            ทั้งหมด ({items.length})
          </button>
          <button
            onClick={() => setFilterType('generator')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              filterType === 'generator' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            สร้างใหม่
          </button>
          <button
            onClick={() => setFilterType('analyzer')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              filterType === 'analyzer' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            วิเคราะห์
          </button>
        </div>
      </div>

      {/* List items */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <h4 className="text-sm font-bold text-slate-600">ยังไม่พบคอนเทนต์ในประวัติ</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            เมื่อคุณกดสร้างคอนเทนต์หรือวิเคราะห์ข้อความ ข้อมูลจะถูกจัดเก็บไว้ที่นี่โดยอัตโนมัติ
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-5 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`p-2 rounded-xl ${
                      item.type === 'generator'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.type === 'generator' ? (
                      <PenTool className="w-4 h-4" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </span>
                      {item.platform && <span>• แพลตฟอร์ม: {item.platform}</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      item.id,
                      item.analysis ? item.analysis.rewrittenVersion || item.content : item.content
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedId === item.id
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอก</span>
                    </>
                  )}
                </button>
              </div>

              {/* Content snippet */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 text-xs sm:text-sm text-slate-700 max-h-48 overflow-y-auto">
                {item.type === 'generator' ? (
                  <MarkdownView content={item.content} />
                ) : (
                  <div>
                    {item.analysis && (
                      <div className="mb-2 pb-2 border-b border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-blue-700">
                          คะแนนภาพรวม: {item.analysis.overallScore}/10
                        </span>
                        <span className="text-slate-500">
                          Hook: {item.analysis.hookRating}
                        </span>
                      </div>
                    )}
                    <p className="line-clamp-4 text-slate-600">{item.content}</p>
                    {item.analysis?.rewrittenVersion && (
                      <div className="mt-3 p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-blue-900 text-xs">
                        <strong>เวอร์ชันปรับปรุง:</strong>
                        <p className="mt-1 line-clamp-3">{item.analysis.rewrittenVersion}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
