import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, CheckCircle2, Sparkles, X, RefreshCw, Cpu, Server } from 'lucide-react';
import { ApiStatus } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiStatus: ApiStatus | null;
  onRefreshStatus: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiStatus,
  onRefreshStatus,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.hasApiKey) {
        setTestResult('เชื่อมต่อสำเร็จ! API Key พร้อมใช้งาน และทำงานผ่านโมเดล ' + data.model);
      } else {
        setTestResult('API Key ยังไม่ได้ตั้งค่าใน process.env.GEMINI_API_KEY');
      }
      onRefreshStatus();
    } catch {
      setTestResult('ไม่สามารถติดต่อ Server ได้ กรุณาตรวจสอบสถานะเซิร์ฟเวอร์');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          title="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              สถานะ API Key & การเชื่อมต่อ
            </h3>
            <p className="text-xs text-slate-500">
              Gemini API Management & Server Connection
            </p>
          </div>
        </div>

        {/* Status card */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-teal-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              การจัดการ API Key อัตโนมัติ
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                apiStatus?.hasApiKey
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus?.hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {apiStatus?.hasApiKey ? 'พร้อมใช้งาน (Active)' : 'ตรวจสอบการตั้งค่า'}
            </span>
          </div>

          <p className="text-sm text-teal-800 leading-relaxed">
            ระบบของเว็บไซต์นี้เชื่อมต่อกับ <strong>Google Gemini API</strong> ผ่านเซิร์ฟเวอร์แบบปลอดภัย โดยใช้คีย์ที่กำหนดใน{' '}
            <code className="bg-white/70 px-1.5 py-0.5 rounded text-xs text-teal-900 font-mono">
              GEMINI_API_KEY
            </code>{' '}
            เรียบร้อยแล้ว คุณสามารถใช้งานสร้างและวิเคราะห์คอนเทนต์ได้ทันทีโดยไม่ต้องใส่คีย์ในฝั่งเบราว์เซอร์
          </p>
        </div>

        {/* System specs */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            รายละเอียดเทคโนโลยีที่ใช้งาน
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                AI Model
              </div>
              <div className="font-semibold text-slate-800">
                {apiStatus?.model || 'gemini-3.8-flash'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Server className="w-3.5 h-3.5 text-teal-500" />
                SDK & Protocol
              </div>
              <div className="font-semibold text-slate-800">
                @google/genai SDK
              </div>
            </div>
          </div>
        </div>

        {/* Guidance on where the API key is configured */}
        <div className="border-t border-slate-100 pt-5 mb-6 text-sm text-slate-600 space-y-2">
          <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            ข้อมูลสำหรับผู้ดูแลระบบ (Developer Guide)
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                ในสภาพแวดล้อม <strong>Google AI Studio</strong>: คีย์จะถูกจัดการผ่านพาเนล <strong>Settings &gt; Secrets</strong> และส่งต่อให้เซิร์ฟเวอร์โดยอัตโนมัติ
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                หากนำไปรันบนเซิร์ฟเวอร์ส่วนตัว สามารถกำหนดค่าในไฟล์ <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.env</code> ด้วยตัวแปร <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY=your_key</code>
              </span>
            </li>
          </ul>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs mb-5 font-medium flex items-center gap-2 ${
              testResult.includes('สำเร็จ')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ API'}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
