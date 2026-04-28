
'use server';
/**
 * @fileOverview A simple chat flow that uses the Gemini model with RAG.
 */

import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { z } from 'zod';
import { retrieveDocuments } from '@/lib/rag';
import { callTyphoonAI } from '@/lib/typhoon';
import { initializeFirebase } from '@/firebase';

// Schema definitions
const ChatRequestSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({ text: z.string() })),
    })
  ),
  prompt: z.string(),
  locale: z.string().optional(),
});

const ChatResponseSchema = z.object({
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    link: z.string().optional(),
    linkText: z.string().optional(),
  })),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `You are an AI legal assistant for Lawslane, a legal tech platform in Thailand.
    Your role is to provide preliminary analysis and information, not definitive legal advice.
    
    Always follow these steps:
    1.  First, use the \`searchArticles\` tool to find relevant information.
    2.  If the tool returns "Legal Documents (PDF)", treat this as high-confidence legal information. Base your answer primarily on this.
    3.  If the tool returns "General Knowledge (Typhoon AI)", this means no specific legal document was found. Use this information to answer the user's question but explicitly state that it is general knowledge, not specific legal advice from the database.
    4.  If no information is found at all, answer based on your own general knowledge.
    5.  Always conclude your response by reminding the user that your analysis is for informational purposes only and they should consult with a qualified lawyer for formal advice.
    6.  **SERVICE RECOMMENDATIONS (CRITICAL)**:
        -   **Contracts (Drafting/Review)**: If the user asks about drafting, reviewing, or creating contracts (agreements, MOUs, NDAs, etc.), you **MUST** recommend the "Contract Service" and provide this link: \`/services/contracts\`. Do NOT recommend finding a lawyer generally for this.
        -   **Business Registration**: If the user asks about registering a company, partnership, or business entity, you **MUST** recommend the "Registration Service" and provide this link: \`/services/registration\`.
        -   **SME Consulting/General Business**: If the user is an SME asking for general advice or has a business dispute, recommend the "SME Consultant" and provide this link: \`/b2b#contact\`.
        -   **Find a Lawyer**: ONLY recommend "Find a Lawyer" (\`/lawyers\`) if:
            -   The user explicitly asks to find a lawyer.
            -   The issue involves **litigation**, **court proceedings**, **suing**, or **criminal cases**.
            -   The issue is complex and does not fit into the specific services above.
            -   **DO NOT** recommend finding a lawyer for every single query. Use it sparingly.
    7.  **CRITICAL**: In the **very first response** of the conversation, you **MUST** introduce yourself as the AI assistant for Lawslane AND explicitly state that your advice is preliminary and not a substitute for a lawyer (Limitation of Liability).
    8.  For all **subsequent messages** (after the first one), **DO NOT** introduce yourself, **DO NOT** say "Hello" or "Sawasdee", and **DO NOT** repeat the disclaimer. Answer the user's question directly and immediately.
    9.  Return the response strictly as a JSON object matching this structure: {"sections": [{"title": "string", "content": "string", "link": "string (optional)", "linkText": "string (optional)"}]}`,
  generationConfig: {
    responseMimeType: 'application/json',
  }
});

/**
 * Native implementation of searchArticles for Gemini tool calling
 */
async function searchArticles(query: string) {
  console.log(`[searchArticles] Searching for: ${query}`);

  // 1. Search RAG (Cloudflare)
  let ragDocs: Array<{ source: string, content: string, score: number }> = [];
  try {
    const allDocs = await retrieveDocuments(query);
    ragDocs = allDocs.filter(doc => doc.score > 0.6);
    console.log(`[searchArticles] RAG found ${allDocs.length} docs, ${ragDocs.length} passed threshold.`);
  } catch (err) {
    console.error("RAG search failed:", err);
  }

  if (ragDocs.length > 0) {
    return {
      results: ragDocs.map(doc => ({
        title: "ข้อมูลจากเอกสารกฎหมาย (PDF)",
        content: doc.content
      }))
    };
  } else {
    console.log("[searchArticles] No relevant RAG docs. Asking Typhoon...");
    const typhoonResponse = await callTyphoonAI(query);
    if (typhoonResponse) {
      return {
        results: [{
          title: "ข้อมูลความรู้ทั่วไป (จาก Typhoon AI)",
          content: typhoonResponse
        }]
      };
    }
  }

  return { results: [] };
}

export async function chat(
  request: z.infer<typeof ChatRequestSchema>
): Promise<ChatResponse> {
  const { history, prompt, locale = 'th' } = request;

  try {
    if (!process.env.GOOGLE_GENAI_API_KEY && !process.env.GOOGLE_API_KEY) {
      throw new Error("No API Key");
    }

    let languageInstruction = "Answer in Thai.";
    if (locale.startsWith('en')) {
      languageInstruction = "Answer in English. IMPORTANT: For any specific legal terms, laws, or sensitive legal advice, you MUST provide the original Thai text alongside the English translation (e.g., 'Civil Code (ประมวลกฎหมายแพ่ง)').";
    } else if (locale.startsWith('zh')) {
      languageInstruction = "Answer in Chinese (Simplified). IMPORTANT: For any specific legal terms, laws, or sensitive legal advice, you MUST provide the original Thai text alongside the Chinese translation.";
    }

    let finalPrompt = `${prompt}\n\n[System Instruction: ${languageInstruction}]`;
    if (history && history.length > 0) {
      finalPrompt += `\n\n[System Note: This is a continuing conversation. Do NOT introduce yourself again. Do NOT say 'Hello' or 'Sawasdee'. Answer the question directly.]`;
    }

    // Convert history to Gemini format
    const geminiHistory: Content[] = history.map(h => ({
      role: h.role,
      parts: h.content.map(c => ({ text: c.text }))
    }));

    // Tool calling logic manual loop (simple version)
    // First, check if we need to call searchArticles
    const toolPrompt = `Analyze if this user query needs legal information lookup. If yes, respond with ONLY the search query. If no, respond with "NONE". Query: ${prompt}`;
    const toolSelection = await model.generateContent(toolPrompt);
    const searchQuery = toolSelection.response.text().trim();

    let context = "";
    if (searchQuery !== "NONE" && searchQuery.length > 2) {
      const toolResult = await searchArticles(searchQuery);
      context = JSON.stringify(toolResult);
    }

    const chatSession = model.startChat({
      history: geminiHistory,
    });

    const result = await chatSession.sendMessage([
      { text: context ? `Context from knowledge base: ${context}\n\nUser Question: ${finalPrompt}` : finalPrompt }
    ]);

    const responseText = result.response.text();
    try {
      const parsed = JSON.parse(responseText);
      return ChatResponseSchema.parse(parsed);
    } catch (e) {
      console.error("[ChatFlow] JSON Parse Error:", responseText);
      return {
        sections: [{
          title: "AI Response",
          content: responseText
        }]
      };
    }
  } catch (error) {
    console.error("[ChatFlow] AI generation failed:", error);
    return await fallbackChat(prompt, locale);
  }
}

import { collection, getDocs, limit, query } from 'firebase/firestore';

async function fallbackChat(prompt: string, locale: string = 'th'): Promise<ChatResponse> {
  console.log("[ChatFlow] Running fallback chat logic...");
  try {
    const { firestore } = initializeFirebase();

    let languageInstruction = "ตอบเป็นภาษาไทย";
    if (locale.startsWith('en')) {
      languageInstruction = "Answer in English. IMPORTANT: For any specific legal terms, laws, or sensitive legal advice, you MUST provide the original Thai text alongside the English translation (e.g., 'Civil Code (ประมวลกฎหมายแพ่ง)').";
    } else if (locale.startsWith('zh')) {
      languageInstruction = "Answer in Chinese (Simplified). IMPORTANT: For any specific legal terms, laws, or sensitive legal advice, you MUST provide the original Thai text alongside the Chinese translation.";
    }

    const t = {
      th: {
        greetingTitle: "สวัสดีครับ (โหมดสำรอง)",
        greetingContent: "สวัสดีครับ! ผมคือผู้ช่วย AI (ในโหมดสำรอง) เนื่องจากระบบหลักขัดข้อง ผมสามารถช่วยค้นหาข้อมูลกฎหมายเบื้องต้นจากฐานข้อมูลให้ได้ครับ ลองพิมพ์คำถามสั้นๆ เช่น 'มรดก', 'หย่า', หรือ 'สัญญา' ได้เลยครับ",
        knowledgeTitle: "ข้อมูลจากฐานความรู้ (โหมดสำรอง)",
        knowledgeIntro: (terms: string) => `จากการค้นหาคำว่า "${terms}" พบข้อมูลที่เกี่ยวข้องดังนี้ครับ:`,
        relatedInfo: "ข้อมูลที่เกี่ยวข้อง",
        article: "บทความ",
        adviceTitle: "คำแนะนำเพิ่มเติม",
        adviceContent: "ข้อมูลข้างต้นเป็นเพียงการค้นหาเบื้องต้นจากฐานข้อมูล แนะนำให้ปรึกษาทนายความเพื่อความถูกต้องครับ",
        findLawyer: "ค้นหาทนายความผู้เชี่ยวชาญ",
        typhoonTitle: "คำตอบจาก AI (Typhoon)",
        typhoonAdviceTitle: "คำแนะนำ",
        typhoonAdviceContent: "คำตอบนี้สร้างโดย AI (Typhoon) จากความรู้ทั่วไป อาจไม่ครอบคลุมกฎหมายเฉพาะเจาะจง แนะนำให้ปรึกษาทนายความ",
        consultLawyerTitle: "แนะนำปรึกษาทนายความ",
        consultLawyerContent: (p: string) => `สำหรับหัวข้อ "${p}" เป็นประเด็นทางกฎหมายที่อาจมีรายละเอียดซับซ้อนเฉพาะบุคคล\n\nเพื่อให้คุณได้รับคำแนะนำที่ถูกต้องและรัดกุมที่สุด ระบบขอแนะนำให้พูดคุยกับทนายความผู้เชี่ยวชาญโดยตรง เพื่อวิเคราะห์ข้อเท็จจริงในเชิงลึกครับ`,
        consultLawyerBtn: "ปรึกษาทนายความ",
      },
      en: {
        greetingTitle: "Hello (Backup Mode)",
        greetingContent: "Hello! I am the AI Assistant (in backup mode). Since the main system is currently unavailable, I can help you search for preliminary legal information from our database. Try typing short keywords like 'Inheritance', 'Divorce', or 'Contract'.",
        knowledgeTitle: "Knowledge Base Results (Backup Mode)",
        knowledgeIntro: (terms: string) => `Based on your search for "${terms}", here is the relevant information found:`,
        relatedInfo: "Related Information",
        article: "Article",
        adviceTitle: "Additional Advice",
        adviceContent: "The information above is a preliminary search from our database. We recommend consulting a lawyer for accuracy.",
        findLawyer: "Find a Lawyer",
        typhoonTitle: "Answer from AI (Typhoon)",
        typhoonAdviceTitle: "Advice",
        typhoonAdviceContent: "This answer was generated by AI (Typhoon) based on general knowledge and may not cover specific legal details. We recommend consulting a lawyer.",
        consultLawyerTitle: "Consult a Lawyer",
        consultLawyerContent: (p: string) => `Regarding "${p}", this is a legal issue that may have complex, case-specific details.\n\nTo receive the most accurate and comprehensive advice, we recommend speaking directly with a specialized lawyer to analyze the facts in depth.`,
        consultLawyerBtn: "Consult a Lawyer",
      },
      zh: {
        greetingTitle: "你好 (备份模式)",
        greetingContent: "你好！我是 AI 助手（备份模式）。由于主系统暂时不可用，我可以帮助您จาก我们的数据库中搜索初步的法律信息。尝试输入简短的关键词，如“继承”、“离婚”หรือ“合同”。",
        knowledgeTitle: "知识库结果 (备份模式)",
        knowledgeIntro: (terms: string) => `根据您搜索的 "${terms}"，以下是找到的相关信息：`,
        relatedInfo: "相关信息",
        article: "文章",
        adviceTitle: "额外建议",
        adviceContent: "以上信息仅为数据库的初步搜索结果。为了准确起见，我们建议咨询律师。",
        findLawyer: "寻找律师",
        typhoonTitle: "AI 回答 (Typhoon)",
        typhoonAdviceTitle: "建议",
        typhoonAdviceContent: "此回答由 AI (Typhoon) 基于一般知识生成，可能不涵盖具体的法律细节。我们建议咨询律师。",
        consultLawyerTitle: "咨询律师",
        consultLawyerContent: (p: string) => `关于 "${p}"，这是一个可能涉及复杂具体细节的法律问题。\n\n为了获得最准确和全面的建议， we recommend speaking directly with a specialized lawyer to analyze the facts in depth.`,
        consultLawyerBtn: "咨询律师",
      }
    };

    const strings = locale.startsWith('en') ? t.en : (locale.startsWith('zh') ? t.zh : t.th);

    const articlesRef = collection(firestore, 'articles');
    const qSnap = query(articlesRef, limit(20));
    const snapshot = await getDocs(qSnap);

    const articles = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: (data.title as string) || '',
        content: (data.content as string) || '',
      };
    });

    const lowerCaseQuery = prompt.toLowerCase();
    const greetings = ['สวัสดี', 'หวัดดี', 'hello', 'hi', 'ทักทาย', '你好'];
    if (greetings.some(g => lowerCaseQuery.includes(g))) {
      return {
        sections: [{
          title: strings.greetingTitle,
          content: strings.greetingContent
        }]
      };
    }

    const cleanPrompt = lowerCaseQuery.replace(/^(คดี|กฎหมาย|เรื่อง|การ|ความ|ข้อหา)/, '').trim();
    const searchTerms = cleanPrompt.split(/\s+/).filter(w => w.length > 1);
    if (cleanPrompt !== lowerCaseQuery) searchTerms.push(lowerCaseQuery);

    const relevantArticles = articles
      .filter(article => {
        const title = article.title.toLowerCase();
        const content = article.content.toLowerCase();
        return searchTerms.some(term => title.includes(term) || content.includes(term));
      })
      .slice(0, 3);

    const sections = [];

    // Search RAG for fallback
    let ragDocs: Array<{ source: string, content: string, score: number }> = [];
    try {
      const allDocs = await retrieveDocuments(cleanPrompt);
      ragDocs = allDocs.filter(doc => doc.score > 0.6);
    } catch (err) {
      console.error("Fallback RAG search failed:", err);
    }

    if (relevantArticles.length > 0 || ragDocs.length > 0) {
      sections.push({
        title: strings.knowledgeTitle,
        content: strings.knowledgeIntro(searchTerms.join('", "'))
      });

      ragDocs.forEach((doc, index) => {
        if (doc.content.trim()) {
          sections.push({
            title: `${strings.relatedInfo} (${index + 1})`,
            content: doc.content.trim()
          });
        }
      });

      relevantArticles.forEach(article => {
        sections.push({
          title: `${strings.article}: ${article.title}`,
          content: article.content.substring(0, 300) + "..."
        });
      });

      sections.push({
        title: strings.adviceTitle,
        content: strings.adviceContent,
        link: "/lawyers",
        linkText: strings.findLawyer
      });
    } else {
      const typhoonResponse = await callTyphoonAI(prompt, languageInstruction);
      if (typhoonResponse) {
        sections.push({ title: strings.typhoonTitle, content: typhoonResponse });
        sections.push({
          title: strings.typhoonAdviceTitle,
          content: strings.typhoonAdviceContent,
          link: "/lawyers",
          linkText: strings.consultLawyerBtn
        });
      } else {
        sections.push({
          title: strings.consultLawyerTitle,
          content: strings.consultLawyerContent(prompt),
          link: "/lawyers",
          linkText: strings.findLawyer
        });
      }
    }

    return { sections };
  } catch (error: any) {
    console.error("[ChatFlow] Fallback logic failed:", error);
    const errorMsg = locale.startsWith('en')
      ? `Sorry, we cannot access the database at this time. Please try again.`
      : (locale.startsWith('zh')
        ? `抱歉，我们目前无法访问数据库。请重试。`
        : `ขออภัยครับ ไม่สามารถเข้าถึงฐานข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่`);

    return {
      sections: [{ title: "System Error", content: errorMsg }]
    };
  }
}
