import React, { useState } from 'react';
import {
  Wand2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  SlidersHorizontal,
  BookmarkCheck,
  Download,
  AlertCircle,
  HelpCircle,
  Send,
  CornerDownRight,
  ChevronDown,
} from 'lucide-react';
import { GenerateParams, HistoryItem } from '../types';
import { MarkdownView } from './MarkdownView';

interface ContentGeneratorProps {
  onSaveToHistory: (item: HistoryItem) => void;
}

const PRESETS = [
  {
    name: '✨ เซรั่มหน้าใส กู้ผิวโทรม',
    productName: 'Aura Glow Vitamin C Serum',
    targetAudience: 'วัยทำงานอายุ 23-35 ปี ผิวหมองคล้ำ นอนดึก หน้าไม่สดใส',
    platform: 'TikTok',
    tone: 'เป็นกันเอง สนุกสนาน',
    contentGoal: 'เพิ่มยอดขายและชวนคอมเมนต์',
    extraDetails: 'จุดเด่น: ซึมไว ไม่เหนอะหนะ เห็นผลใน 7 วัน ลดรอยสิว มีโปร 1 แถม 1 ถึงสิ้นเดือนนี้เท่านั้น',
  },
  {
    name: '☕ คาเฟ่ Specialty & ขนมโฮมเมด',
    productName: 'Craft & Bean Roasters',
    targetAudience: 'สายคาเฟ่ คนรักกาแฟคุณภาพ คนหาที่นั่งทำงานบรรยากาศดี',
    platform: 'Instagram',
    tone: 'พรีเมียม Luxury หรูหรา',
    contentGoal: 'สร้าง Brand Awareness และให้คนตามมาเช็คอิน',
    extraDetails: 'เมล็ดกาแฟนำเข้า Single Origin คั่วสดใหม่ มีมุมถ่ายรูปสไตล์ Minimal แสงธรรมชาติสวยมาก เปิดทุกวัน 08.00 - 18.00 น.',
  },
  {
    name: '📚 คอร์สออนไลน์ AI Marketing',
    productName: 'Mastering AI for Digital Marketers 2026',
    targetAudience: 'เจ้าของธุรกิจ พ่อค้าแม่ค้าออนไลน์ นักการตลาดที่อยากประหยัดเวลาทำงาน',
    platform: 'Facebook',
    tone: 'มืออาชีพ น่าเชื่อถือ',
    contentGoal: 'กระตุ้นยอดขายและปิดการขาย Early Bird',
    extraDetails: 'สอนใช้ AI ทำคอนเทนต์ ยิงแอด วิเคราะห์ข้อมูล จาก 0 จนเป็นมือโปร ราคาปกติ 4,900 เหลือเพียง 1,990 สำหรับ 50 ท่านแรก',
  },
  {
    name: '🧹 บริการทำความสะอาดคอนโด',
    productName: 'CleanHome Express',
    targetAudience: 'ชาวคอนโด คนทำงานเวลาน้อย แม่และเด็กที่ต้องการความสะอาดปลอดภัย',
    platform: 'Lemon8',
    tone: 'ให้ความรู้ สร้างแรงบันดาลใจ',
    contentGoal: 'ให้ความรู้และปิดการขาย',
    extraDetails: 'แม่บ้านผ่านการตรวจประวัติ 100% ใช้น้ำยาออร์แกนิก ปลอดภัยต่อสัตว์เลี้ยง รับประกันความพึงพอใจ ทักจองคิวรับส่วนลด 15%',
  },
];

const PLATFORMS = [
  'Facebook',
  'TikTok',
  'Instagram',
  'Lemon8',
  'Twitter/X',
  'LINE Official Account',
  'Blog/Website',
  'YouTube Shorts',
];

const TONES = [
  { label: 'มืออาชีพ น่าเชื่อถือ (Professional)', val: 'มืออาชีพ น่าเชื่อถือ' },
  { label: 'เป็นกันเอง สนุกสนาน (Friendly & Casual)', val: 'เป็นกันเอง สนุกสนาน' },
  { label: 'กระตุ้นยอดขาย เร่งด่วน (Urgent & Sales-focused)', val: 'กระตุ้นยอดขาย โปรโมชั่นเร่งด่วน' },
  { label: 'ให้ความรู้ ชี้ทางออก (Educational & Problem-solving)', val: 'ให้ความรู้ สร้างแรงบันดาลใจ' },
  { label: 'หรูหรา พรีเมียม (Luxury & Premium)', val: 'พรีเมียม Luxury หรูหรา' },
  { label: 'เล่าเรื่องจับใจ (Emotional Storytelling)', val: 'สตอรี่ทริลลิ่ง เล่าเรื่องจับใจ' },
];

const GOALS = [
  'เพิ่มยอดขายและปิดการขาย (Conversion)',
  'สร้างการรับรู้แบรนด์ (Brand Awareness)',
  'สร้างการมีส่วนร่วมและคอมเมนต์ (Engagement)',
  'ให้ความรู้และสร้างความน่าเชื่อถือ (Authority)',
  'เปิดตัวสินค้า/บริการใหม่ (New Launch)',
  'โปรโมชั่น Flash Sale / ดีลพิเศษ (Special Offer)',
];

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onSaveToHistory }) => {
  const [formData, setFormData] = useState<GenerateParams>({
    productName: '',
    targetAudience: '',
    platform: 'Facebook',
    tone: 'มืออาชีพ น่าเชื่อถือ',
    contentGoal: 'เพิ่มยอดขายและปิดการขาย (Conversion)',
    extraDetails: '',
    includeVariations: true,
  });

  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setFormData({
      productName: preset.productName,
      targetAudience: preset.targetAudience,
      platform: preset.platform,
      tone: preset.tone,
      contentGoal: preset.contentGoal,
      extraDetails: preset.extraDetails,
      includeVariations: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim() || !formData.targetAudience.trim()) {
      setError('กรุณาระบุชื่อสินค้า/บริการ และกลุ่มเป้าหมายให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);

    try {
      const res = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ไม่สามารถสร้างคอนเทนต์ได้');
      }

      setOutput(data.content);

      // Auto-save to history
      onSaveToHistory({
        id: 'gen-' + Date.now(),
        type: 'generator',
        title: `${formData.productName} (${formData.platform})`,
        timestamp: Date.now(),
        platform: formData.platform,
        content: data.content,
        inputPrompt: `กลุ่มเป้าหมาย: ${formData.targetAudience} | โทน: ${formData.tone}`,
      });
      setSaved(true);
    } catch (err: any) {
      setError(err?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini API');
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!output || refining) return;
    setRefining(true);
    setError(null);

    try {
      const res = await fetch('/api/marketing/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: output,
          instruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาดในการปรับปรุง');

      setOutput(data.refinedContent);
      setCopied(false);
      setSaved(false);
    } catch (err: any) {
      setError(err?.message || 'ปรับปรุงไม่สำเร็จ');
    } finally {
      setRefining(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${formData.platform}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Preset Pills */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            ตัวอย่างพร้อมใช้งาน (คลิกเพื่อทดสอบทันที)
          </span>
          <span className="text-[11px] text-slate-400">1-Click Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 transition-all cursor-pointer font-medium"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on Left, Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-bold">
                1
              </span>
              ข้อมูลคอนเทนต์การตลาด
            </h2>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  productName: '',
                  targetAudience: '',
                  platform: 'Facebook',
                  tone: 'มืออาชีพ น่าเชื่อถือ',
                  contentGoal: 'เพิ่มยอดขายและปิดการขาย (Conversion)',
                  extraDetails: '',
                  includeVariations: true,
                })
              }
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> ล้างข้อมูล
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อสินค้า / แบรนด์ / บริการ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="เช่น เซรั่มบำรุงผิวหน้า, คอร์สออนไลน์ AI, คลินิกทันตกรรม"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                กลุ่มเป้าหมาย (Target Audience) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="เช่น วัยทำงาน 25-40 ปี มีปัญหาปวดหลัง, เจ้าของธุรกิจขนาดย่อม"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              />
            </div>

            {/* Platform & Tone (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  แพลตฟอร์มปลายทาง
                </label>
                <div className="relative">
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none appearance-none bg-white transition-all pr-8"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  โทนเสียง (Tone of Voice)
                </label>
                <div className="relative">
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none appearance-none bg-white transition-all pr-8"
                  >
                    {TONES.map((t) => (
                      <option key={t.val} value={t.val}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-3" />
                </div>
              </div>
            </div>

            {/* Content Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                วัตถุประสงค์หลักของคอนเทนต์
              </label>
              <div className="relative">
                <select
                  value={formData.contentGoal}
                  onChange={(e) => setFormData({ ...formData, contentGoal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none appearance-none bg-white transition-all pr-8"
                >
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-3" />
              </div>
            </div>

            {/* Extra Details / Selling Points */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>จุดขาย / โปรโมชั่น / ข้อเสนอพิเศษ (ไม่บังคับ)</span>
                <span className="text-[11px] text-slate-400 font-normal">Optional</span>
              </label>
              <textarea
                rows={3}
                value={formData.extraDetails}
                onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}
                placeholder="เช่น จุดเด่นพิเศษ, ราคาเปิดตัว 990 บาท, ซื้อ 1 แถม 1 ถึงสิ้นเดือน, ทักแชทส่งฟรี"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Checkbox for short variation */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.includeVariations}
                onChange={(e) => setFormData({ ...formData, includeVariations: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded-sm border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-600 select-none">
                ขอเวอร์ชันสั้นกระชับ (Short & Punchy) เพิ่มเติมในผลลัพธ์
              </span>
            </label>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium rounded-xl shadow-md shadow-teal-600/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">กำลังรังสรรค์คอนเทนต์ด้วย Gemini 3.8...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">สร้างคอนเทนต์ทันที (Generate)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col min-h-[580px] overflow-hidden">
          {/* Output Header */}
          <div className="p-4 sm:px-6 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-teal-100/60 text-teal-700 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-800">ผลลัพธ์คอนเทนต์</h3>
                <p className="text-[11px] text-slate-500">
                  {formData.platform ? `สำหรับ ${formData.platform}` : 'พร้อมนำไปปรับใช้'}
                </p>
              </div>
            </div>

            {output && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  title="คัดลอกทั้งหมด"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="บันทึกเป็นไฟล์ .txt"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Output Content Area */}
          <div className="p-6 sm:p-7 flex-grow overflow-y-auto bg-slate-50/30">
            {loading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100/60 text-teal-600 flex items-center justify-center animate-bounce">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-teal-400/20 absolute inset-0 animate-ping" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">
                    AI กำลังวิเคราะห์สินค้าและกลุ่มเป้าหมาย...
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    กำลังจัดโครงสร้างพาดหัว (Headline Hooks), เนื้อหาหลัก, Call to Action และแฮชแท็กที่เหมาะกับ {formData.platform}
                  </p>
                </div>
              </div>
            ) : output ? (
              <div className="space-y-6">
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <MarkdownView content={output} />
                </div>

                {/* Quick Refine Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                      ปรับแต่งด่วนด้วย AI (Quick Refine)
                    </span>
                    {refining && (
                      <span className="text-[11px] text-teal-600 animate-pulse font-medium">
                        กำลังปรับปรุงเนื้อหา...
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={refining}
                      onClick={() => handleRefine('ช่วยปรับข้อความให้กระชับ สั้นลง เหมาะกับโพสต์ที่ต้องการความเร็ว')}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition-colors cursor-pointer font-medium disabled:opacity-50"
                    >
                      ✂️ ทำให้สั้นกระชับ
                    </button>
                    <button
                      type="button"
                      disabled={refining}
                      onClick={() => handleRefine('เพิ่มคำกระตุ้นการตัดสินใจ ย้ำความคุ้มค่า และกระตุ้นยอดขายให้ดุดันยิ่งขึ้น')}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition-colors cursor-pointer font-medium disabled:opacity-50"
                    >
                      🔥 เน้นเร่งปิดการขาย
                    </button>
                    <button
                      type="button"
                      disabled={refining}
                      onClick={() => handleRefine('ใส่อีโมจิที่น่ารัก ดึงดูดสายตา และจัดวรรคตอนให้อ่านสบายตาขึ้น')}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition-colors cursor-pointer font-medium disabled:opacity-50"
                    >
                      ✨ เพิ่มอีโมจิสดใส
                    </button>
                    <button
                      type="button"
                      disabled={refining}
                      onClick={() => handleRefine('ปรับโครงสร้างเป็นแบบ Storytelling เล่าเรื่องจากปัญหา สู่ทางออกของสินค้า')}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition-colors cursor-pointer font-medium disabled:opacity-50"
                    >
                      📖 เล่าเรื่อง Storytelling
                    </button>
                    <button
                      type="button"
                      disabled={refining}
                      onClick={() => handleRefine('Translate the marketing copy into high-converting English suitable for international audience')}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition-colors cursor-pointer font-medium disabled:opacity-50"
                    >
                      🌐 แปลเป็นภาษาอังกฤษ
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-1">
                  ยังไม่มีคอนเทนต์ที่สร้าง
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  กรอกข้อมูลสินค้าและกลุ่มเป้าหมายทางซ้ายมือ หรือคลิกตัวอย่างด้านบน แล้วกด{' '}
                  <strong className="text-teal-700">"สร้างคอนเทนต์ทันที"</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
