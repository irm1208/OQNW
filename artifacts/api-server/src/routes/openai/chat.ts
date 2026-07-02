import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
type OpenAIClient = { chat: { completions: { create: (...args: unknown[]) => unknown } } };

let cachedOpenai: OpenAIClient | null = null;
async function getOpenai(): Promise<OpenAIClient | null> {
  if (cachedOpenai) return cachedOpenai;
  try {
    const mod = await import("@workspace/integrations-openai-ai-server");
    cachedOpenai = mod.openai as unknown as OpenAIClient;
    return cachedOpenai;
  } catch {
    return null;
  }
}

const CreateOpenaiConversationBody = {
  safeParse: (data: unknown) => {
    if (typeof data !== "object" || data === null) return { success: false as const };
    const d = data as Record<string, unknown>;
    return { success: true as const, data: { title: typeof d.title === "string" ? d.title : "New Conversation" } };
  },
};
const SendOpenaiMessageBody = {
  safeParse: (data: unknown) => {
    if (typeof data !== "object" || data === null) return { success: false as const };
    const d = data as Record<string, unknown>;
    if (typeof d.content !== "string" || d.content.length === 0) return { success: false as const };
    return { success: true as const, data: { content: d.content } };
  },
};

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are a knowledgeable research support specialist at OmniQure Peptide Research Institute, a UK-based supplier of research-grade peptides.

Your role is to help qualified researchers with pre-purchase and technical questions about peptides. You are professional, precise, and concise.

Key facts about OmniQure:
- All 81 peptides are independently verified with purity between 98.1% and 99.7%
- Storage: most lyophilised peptides store at −20 °C, protected from light and moisture
- Reconstitution: always use sterile water or appropriate buffer; bacteriostatic water extends stability
- Products are for in-vitro research use only — never for human or veterinary diagnostic use
- Shipping: worldwide DHL Express; free shipping on orders over £100
- Prices displayed in multiple currencies; multi-currency display available at checkout

When asked about a specific peptide, draw on your knowledge of:
- Purity and analytical methods (the validated purity method, AAA)
- Storage conditions and shelf life
- Reconstitution protocols and solubility characteristics
- Research applications and peptide class (e.g., healing, GLP-1, growth hormone, nootropic)
- Compatibility with common buffers and solvents

Keep answers focused and research-appropriate. If you don't know something specific, say so clearly and suggest contacting the team at support@omniqure.com.

Never provide medical advice, dosing recommendations for human use, or suggest these peptides are safe for human administration.`;

router.post("/conversations", async (req, res) => {
  const body = CreateOpenaiConversationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [conv] = await db
    .insert(conversations)
    .values({ title: body.data.title })
    .returning();

  res.status(201).json(conv);
});

router.get("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const conv = await db.query.conversations.findFirst({
    where: eq(conversations.id, id),
    with: { messages: { orderBy: [asc(messages.createdAt)] } },
  });

  if (!conv) { res.status(404).json({ error: "Not found" }); return; }
  res.json(conv);
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const body = SendOpenaiMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const client = await getOpenai();
  if (!client) {
    res.status(503).json({ error: "OpenAI integration not configured" });
    return;
  }

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt))
    .limit(40);

  await db.insert(messages).values({
    conversationId: id,
    role: "user",
    content: body.data.content,
  });

  const chatMessages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: body.data.content },
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await (client.chat.completions.create as (opts: unknown) => Promise<AsyncIterable<{ choices: Array<{ delta: { content?: string } }> }>>)({
      model: "gpt-4o-mini",
      max_completion_tokens: 512,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error(err, "OpenAI stream error");
    res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
    res.end();
  }
});

export default router;
