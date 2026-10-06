import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Helper with retry logic and model fallback for transient high demand
  async function generateContentWithRetry(params: any, retries = 2, delayMs = 1500): Promise<any> {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const errMsg = (err?.message || '') + ' ' + (err?.stack || '') + ' ' + String(err);
      const isTransient =
        errMsg.includes('503') ||
        errMsg.includes('429') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('high demand') ||
        err?.status === 503 ||
        err?.code === 503;

      if (retries > 0 && isTransient) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        // On last retry attempt, try with gemini-flash-latest if primary was 3.8
        const fallbackParams = retries === 1 && params.model === 'gemini-3.8-flash'
          ? { ...params, model: 'gemini-flash-latest' }
          : params;
        return generateContentWithRetry(fallbackParams, retries - 1, delayMs * 1.5);
      }
      throw err;
    }
  }

  // Health / Status endpoint
  app.get('/api/status', (_req, res) => {
    res.json({
      status: 'ready',
      model: 'gemini-3.8-flash',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      provider: 'Google AI Studio',
    });
  });

  // Content Generation endpoint
  app.post('/api/marketing/generate', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in the server environment.',
        });
      }

      const {
        productName,
        targetAudience,
        platform = 'Facebook',
        tone = 'มืออาชีพ น่าเชื่อถือ',
        contentGoal = 'เพิ่มยอดขายและสร้างการรับรู้',
        extraDetails = '',
        includeVariations = true,
      } = req.body;

      if (!productName || !targetAudience) {
        return res.status(400).json({
          error: 'กรุณาระบุชื่อสินค้า/บริการ และกลุ่มเป้าหมาย',
        });
      }

      const systemInstruction = `คุณคือสุดยอด Content Marketer, Copywriter และ Social Media Strategist ระดับมืออาชีพ เชี่ยวชาญตลาดไทยและพฤติกรรมผู้บริโภคยุคใหม่
หน้าที่ของคุณคือสร้างสรรค์คอนเทนต์การตลาดที่ตรงเป้า ดึงดูดสายตา หยุดนิ้วโป้ง และสร้าง Conversion สูง

คำแนะนำในการเขียน:
1. ปรับสไตล์และโครงสร้างให้เหมาะกับแพลตฟอร์ม ${platform} โดยเฉพาะ (เช่น TikTok เน้นสคริปต์/ฮุคสั้นๆ, Facebook เน้นเปิดหัวดึงดูด+เว้นบรรทัดอ่านง่าย, Instagram เน้นมู้ดโทนสวยงาม, Lemon8 เน้นรีวิวจริงใจป้ายยา, Twitter/X เน้นสั้นกระชับ)
2. ใช้น้ำเสียง (Tone of Voice): "${tone}"
3. เป้าหมายหลักของโพสต์: "${contentGoal}"
4. ใช้ภาษาไทยที่เป็นธรรมชาติ น่าสนใจ ไม่ดูแปลแข็งๆ แบ่งวรรคตอนให้อ่านสบายตา มีการใช้ Emoji ที่สอดคล้องกับแบรนด์
5. โครงสร้างที่ต้องจัดให้ครบ:
   - 🎯 Headline Hooks (พาดหัวหยุดนิ้วโป้ง 2-3 ตัวเลือก)
   - 📝 โพสต์ฉบับสมบูรณ์ (Primary Post Copy) ที่พร้อมก๊อปปี้ไปโพสต์ทันที
   - 📢 Call To Action (CTA) ที่กระตุ้นให้ลูกค้าทักแชท สั่งซื้อ หรือคอมเมนต์
   - 🏷️ แฮชแท็กแนะนำ (#Hashtags) 5-10 แท็กที่เข้ากลุ่ม
   - 💡 Pro Tips เสริมสำหรับคนทำคอนเทนต์ (เช่น แนะนำรูปภาพ/วิดีโอที่ควรใช้, ช่วงเวลาที่ควรโพสต์)`;

      const prompt = `ช่วยเขียนคอนเทนต์การตลาดระดับพรีเมียมสำหรับ:
- สินค้า/บริการ: ${productName}
- กลุ่มเป้าหมาย: ${targetAudience}
- แพลตฟอร์มหลัก: ${platform}
- โทนเสียง: ${tone}
- วัตถุประสงค์: ${contentGoal}
${extraDetails ? `- ข้อมูลจุดเด่น/โปรโมชั่น/ข้อเสนอพิเศษ: ${extraDetails}` : ''}
${includeVariations ? '- ขอเวอร์ชันเสริมสั้นกระชับ (Short & Punchy Version) ให้อีก 1 ตัวเลือกด้วย' : ''}

กรุณาจัดรูปแบบ Markdown ให้อ่านง่าย เป็นระเบียบ ชัดเจน พร้อมนำไปใช้งานได้จริงทันที`;

      const response = await generateContentWithRetry({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        content: response.text || '',
        platform,
        productName,
      });
    } catch (error: any) {
      console.error('Error generating content:', error);
      return res.status(500).json({
        error: error?.message || 'เกิดข้อผิดพลาดในการสร้างคอนเทนต์ด้วย AI',
      });
    }
  });

  // Content Analyzer endpoint (Structured JSON analysis + suggestions)
  app.post('/api/marketing/analyze', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in the server environment.',
        });
      }

      const {
        text,
        platform = 'ทั่วไป',
        objective = 'เพิ่มยอดการมีส่วนร่วมและยอดขาย',
      } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          error: 'กรุณาใส่ข้อความคอนเทนต์ที่ต้องการให้วิเคราะห์',
        });
      }

      const systemInstruction = `คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์คอนเทนต์การตลาด (Senior Content Marketing Auditor & Conversion Rate Optimization Specialist)
หน้าที่ของคุณคือวิเคราะห์โพสต์การตลาดที่ได้รับอย่างละเอียด ตรงไปตรงมา และให้คำแนะนำที่สามารถนำไปปรับใช้ได้ผลจริง
ให้คะแนนประเมินอย่างเป็นธรรมและมีมาตรฐานวิชาชีพ พร้อมเขียนเวอร์ชันปรับปรุง (Optimized Rewrite) ที่ดีกว่าเดิมอย่างเห็นได้ชัด`;

      const prompt = `กรุณาวิเคราะห์ข้อความคอนเทนต์การตลาดนี้:
"""
${text}
"""
(แพลตฟอร์มที่ตั้งใจลง: ${platform}, วัตถุประสงค์: ${objective})`;

      const response = await generateContentWithRetry({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: {
                type: Type.NUMBER,
                description: 'คะแนนภาพรวมเต็ม 10 (เช่น 8.5)',
              },
              engagementScore: {
                type: Type.NUMBER,
                description: 'คะแนนโอกาสสร้าง Engagement เต็ม 10',
              },
              clarityScore: {
                type: Type.NUMBER,
                description: 'คะแนนความชัดเจนและกระชับเต็ม 10',
              },
              ctaScore: {
                type: Type.NUMBER,
                description: 'คะแนนความชัดเจนของ Call to Action เต็ม 10',
              },
              hookRating: {
                type: Type.STRING,
                description: 'การประเมินประโยคเปิดหัว เช่น "ยอดเยี่ยม", "ปานกลาง", "ควรปรับให้ดึงดูดกว่านี้"',
              },
              verdict: {
                type: Type.STRING,
                description: 'สรุปภาพรวมสั้นๆ ใน 1-2 ประโยค',
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'จุดเด่น 3-4 ข้อของข้อความนี้',
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'จุดที่ยังขาดหรือจุดที่ควรปรับปรุง 2-4 ข้อ',
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'ข้อเสนอแนะเชิงลึกที่ทำตามได้ทันที 3-4 ข้อ',
              },
              rewrittenVersion: {
                type: Type.STRING,
                description: 'เวอร์ชันที่ปรับปรุงใหม่ให้สะกดสายตาและเพิ่มยอดขาย พร้อมนำไปโพสต์ได้ทันที',
              },
            },
            required: [
              'overallScore',
              'engagementScore',
              'clarityScore',
              'ctaScore',
              'hookRating',
              'verdict',
              'strengths',
              'weaknesses',
              'suggestions',
              'rewrittenVersion',
            ],
          },
        },
      });

      const jsonStr = response.text || '{}';
      const parsed = JSON.parse(jsonStr);
      return res.json({ analysis: parsed });
    } catch (error: any) {
      console.error('Error analyzing content:', error);
      return res.status(500).json({
        error: error?.message || 'เกิดข้อผิดพลาดในการวิเคราะห์คอนเทนต์',
      });
    }
  });

  // Content Quick Refinement endpoint
  app.post('/api/marketing/refine', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in the server environment.',
        });
      }

      const { content, instruction } = req.body;

      if (!content || !instruction) {
        return res.status(400).json({
          error: 'กรุณาระบุข้อความเดิมและคำสั่งปรับปรุง',
        });
      }

      const systemInstruction = `คุณคือนักเขียนคอนเทนต์มืออาชีพ ปรับแก้ข้อความตามคำขอของผู้ใช้ โดยคงใจความสำคัญไว้ และทำให้สำนวนสละสลวย น่าสนใจที่สุด`;

      const prompt = `ข้อความต้นฉบับ:
"""
${content}
"""

คำสั่งที่ต้องการให้ปรับปรุง:
"${instruction}"

โปรดส่งกลับข้อความเวอร์ชันปรับปรุงที่พร้อมใช้งานทันที`;

      const response = await generateContentWithRetry({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { systemInstruction },
      });

      return res.json({ refinedContent: response.text || '' });
    } catch (error: any) {
      console.error('Error refining content:', error);
      return res.status(500).json({
        error: error?.message || 'เกิดข้อผิดพลาดในการปรับแต่งข้อความ',
      });
    }
  });

  // Frontend Serving (Vite in dev, static files in production)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Marketing Assistant server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
