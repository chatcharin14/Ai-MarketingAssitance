import React, { useState } from 'react';
import {
  BarChart3,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  FileText,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { AnalysisResult, HistoryItem } from '../types';
import { MarkdownView } from './MarkdownView';

interface ContentAnalyzerProps {
  onSaveToHistory: (item: HistoryItem) => void;
}

const SAMPLE_POSTS = [
  {
    title: 'ตัวอย่าง 1: โพสต์ขายทั่วไปที่ขาด Call To Action',
    text: `วันนี้มีกาแฟตัวใหม่เข้ามาครับ คั่วสด หอมมาก เป็นอราบิก้าแท้จากดอยช้าง ใครชอบดื่มกาแฟดริปแวะมาลองชิมได้เลยนะ มีเบเกอรี่ด้วยครับ ขอบคุณครับ`,
    platform: 'Facebook',
    objective: 'เพิ่มยอดขายและลูกค้าหน้าร้าน',
  },
  {
    title: 'ตัวอย่าง 2: แคปชั่นสกินแคร์ที่ข้อมูลแน่นแต่อ่านยาก',
    text: `เซรั่มตัวนี้สกัดจากวิตามินซีบริสุทธิ์ 15% พร้อมไนอะซินาไมด์ และไฮยาลูรอน 8 โมเลกุล ช่วยยับยั้งการสร้างเม็ดสีเมลานิน เสริมสร้างเกราะป้องกันผิว ซึมลึกถึงชั้นเดอร์มิส มีสารแอนตี้ออกซิแดนท์เข้มข้น ไม่ใส่พาราเบน ไม่ใส่น้ำหอม ไม่แต่งสี คนท้องใช้ได้ ราคา 450 บาท ส่งฟรี สั่งซื้อได้ที่อินบ็อกซ์`,
    platform: 'Lemon8',
    objective: 'สร้างความน่าเชื่อถือและเพิ่มยอดสั่งซื้อ',
  },
  {
    title: 'ตัวอย่าง 3: สคริปต์วิดีโอสั้นที่เปิดหัวยังไม่หยุดนิ้ว',
    text: `สวัสดีครับทุกคน วันนี้ผมจะมาแนะนำ 3 เทคนิคในการทำธุรกิจออนไลน์ในปีนี้ สำหรับคนที่กำลังเริ่มต้น ไม่รู้จะขายอะไร ลองฟังคลิปนี้ดูนะครับ ข้อแรกคือ...`,
    platform: 'TikTok',
    objective: 'เพิ่มยอดวิวและคนกดติดตาม',
  },
];

export const ContentAnalyzer: React.FC<ContentAnalyzerProps> = ({ onSaveToHistory }) => {
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState('Facebook');
  const [objective, setObjective] = useState('เพิ่มยอดการมีส่วนร่วมและยอดขาย');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  const handleApplySample = (sample: typeof SAMPLE_POSTS[0]) => {
    setText(sample.text);
    setPlatform(sample.platform);
    setObjective(sample.objective);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('กรุณาวางข้อความคอนเทนต์การตลาดที่ต้องการให้วิเคราะห์');
      return;
    }

    setLoading(true);
    setError(null);
    setCopiedRewrite(false);

    try {
      const res = await fetch('/api/marketing/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          platform,
          objective,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'วิเคราะห์คอนเทนต์ไม่สำเร็จ');
      }

      setResult(data.analysis);

      // Save to history
      onSaveToHistory({
        id: 'ana-' + Date.now(),
        type: 'analyzer',
        title: `วิเคราะห์: ${text.slice(0, 35)}...`,
        timestamp: Date.now(),
        platform,
        content: text,
        analysis: data.analysis,
      });
    } catch (err: any) {
      setError(err?.message || 'เกิดข้อผิดพลาดในการวิเคราะห์ด้วย Gemini');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRewritten = () => {
    if (!result?.rewrittenVersion) return;
    navigator.clipboard.writeText(result.rewrittenVersion);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2200);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 7.0) return 'text-teal-600 bg-teal-50 border-teal-200';
    if (score >= 5.0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Sample Pills */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ตัวอย่างข้อความสำหรับทดสอบ (Sample Texts)
          </span>
          <span className="text-[11px] text-slate-400">1-Click Test</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_POSTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer font-medium"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form on Left, Analysis Audit on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                1
              </span>
              วางข้อความที่ต้องการวิเคราะห์
            </h2>
            <button
              type="button"
              onClick={() => {
                setText('');
                setResult(null);
                setError(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> ล้างข้อความ
            </button>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เนื้อหาโพสต์ / แคปชั่น / โฆษณา <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={9}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="วางข้อความแคปชั่น โพสต์ Facebook, สคริปต์ TikTok, หรือข้อความบรอดแคสต์ LINE ที่คุณเขียนไว้..."
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
              />
              <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                <span>จำนวนตัวอักษร: {text.length} ตัวอักษร</span>
                <span>แนะนำ: อย่างน้อย 30-50 ตัวอักษร</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  แพลตฟอร์ม
                </label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white transition-all pr-8"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Lemon8">Lemon8</option>
                    <option value="Twitter/X">Twitter/X</option>
                    <option value="LINE OA">LINE Official Account</option>
                    <option value="Blog/Website">บทความ Blog</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  เป้าหมายที่หวังผล
                </label>
                <div className="relative">
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white transition-all pr-8"
                  >
                    <option value="เพิ่มยอดการมีส่วนร่วมและยอดขาย">ยอดขาย + Engagement</option>
                    <option value="สร้างการรับรู้แบรนด์ (Awareness)">สร้างการรับรู้ (Awareness)</option>
                    <option value="ชวนคอมเมนต์/แชร์ (Viral)">ชวนคอมเมนต์/แชร์ (Viral)</option>
                    <option value="ดึงคนทักแชทสอบถาม (Lead Gen)">ดึงคนทักแชท (Lead Gen)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-3" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">กำลังวิเคราะห์อย่างละเอียดด้วย Gemini 3.8...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm font-semibold">เริ่มวิเคราะห์คอนเทนต์ (Audit Content)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column: Audit Dashboard */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col min-h-[580px] overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:px-6 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-800">ผลการวิเคราะห์ & คะแนนประเมิน</h3>
                <p className="text-[11px] text-slate-500">Marketing Conversion Audit</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7 flex-grow overflow-y-auto bg-slate-50/30">
            {loading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100/60 text-blue-600 flex items-center justify-center animate-bounce">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-400/20 absolute inset-0 animate-ping" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">
                    AI กำลังตรวจสอบโครงสร้างข้อความ...
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    ประเมินพลังประโยคเปิด (Hook), ความน่าสนใจ, Call to Action และสร้างเวอร์ชันที่ปรับปรุงใหม่ให้คุณ
                  </p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Score & Verdict Card */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        คะแนนภาพรวม (Overall Score)
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                          {result.overallScore}
                        </span>
                        <span className="text-base font-medium text-slate-400">/ 10</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="text-slate-400 mr-1.5">พลังประโยคเปิด:</span>
                        <strong className="text-slate-800">{result.hookRating}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Verdict text */}
                  <div className="mt-4 text-sm text-slate-700 bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl leading-relaxed">
                    <strong>บทวิจารณ์โดยสังเขป:</strong> {result.verdict}
                  </div>

                  {/* Mini metrics bar */}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                      <div className="text-[11px] text-slate-500 mb-0.5">Engagement</div>
                      <div className="text-lg font-bold text-blue-700">
                        {result.engagementScore}/10
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                      <div className="text-[11px] text-slate-500 mb-0.5">ความชัดเจน (Clarity)</div>
                      <div className="text-lg font-bold text-teal-700">
                        {result.clarityScore}/10
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                      <div className="text-[11px] text-slate-500 mb-0.5">CTA Strength</div>
                      <div className="text-lg font-bold text-indigo-700">
                        {result.ctaScore}/10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses 2-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      จุดเด่นของข้อความนี้ (Strengths)
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {result.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      จุดที่ควรปรับปรุง (Weaknesses)
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {result.weaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">!</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggestions Card */}
                <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-xs">
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    คำแนะนำเชิงลึกเพื่อเพิ่มยอดขาย (Actionable Tips)
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    {result.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/50">
                        <span className="text-indigo-600 font-bold mt-0.5 shrink-0">💡</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rewritten / Optimized Version with 1-Click Copy */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 sm:p-6 rounded-2xl shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <h4 className="text-sm font-bold text-white">
                        เวอร์ชันปรับปรุงสมบูรณ์แบบ (Optimized Rewrite)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyRewritten}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedRewrite
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {copiedRewrite ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>คัดลอกแล้ว!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>คัดลอกเวอร์ชันนี้</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line font-normal text-slate-100 border border-white/10">
                    {result.rewrittenVersion}
                  </div>
                  <p className="text-[11px] text-blue-200/80">
                    * ปรับปรุงให้มีประโยคเปิดดึงดูดสายตา วางโครงสร้างให้อ่านง่าย และมี Call to Action ชัดเจน
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-1">
                  ยังไม่ได้เริ่มวิเคราะห์
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  วางข้อความของคุณทางซ้ายมือ หรือคลิกตัวอย่างด้านบน แล้วกด{' '}
                  <strong className="text-blue-700">"เริ่มวิเคราะห์คอนเทนต์"</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
