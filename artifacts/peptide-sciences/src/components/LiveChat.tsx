import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm the OmniQure research assistant. I can help with questions about peptide purity, storage, reconstitution, compatibility, or anything else before you order.\n\nHow can I help?",
};

const SUGGESTED = [
  "What purity level are your peptides?",
  "How should I store lyophilised peptides?",
  "How do I reconstitute BPC-157?",
  "What's included with each order?",
];

export default function LiveChat() {
  const [open, setOpen]           = useState(false);
  const [convId, setConvId]       = useState<number | null>(null);
  const [msgs, setMsgs]           = useState<Message[]>([WELCOME]);
  const [input, setInput]         = useState("");
  const [busy, setBusy]           = useState(false);
  const [unread, setUnread]       = useState(0);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLTextAreaElement>(null);
  const abortRef                  = useRef<AbortController | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const ensureConversation = useCallback(async (): Promise<number> => {
    if (convId !== null) return convId;
    const res  = await fetch("/api/openai/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Research chat" }),
    });
    const conv = await res.json() as { id: number };
    setConvId(conv.id);
    return conv.id;
  }, [convId]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || busy) return;
    setInput("");
    setBusy(true);

    const userMsg: Message = { role: "user", content: text.trim() };
    const placeholder: Message = { role: "assistant", content: "", streaming: true };

    setMsgs(prev => [...prev, userMsg, placeholder]);

    try {
      const id = await ensureConversation();
      abortRef.current  = new AbortController();

      const res = await fetch(`/api/openai/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
        signal: abortRef.current.signal,
      });

      const reader = res.body!.getReader();
      const dec    = new TextDecoder();
      let   full   = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const lines = dec.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(line.slice(6)) as { content?: string; done?: boolean; error?: string };
            if (evt.content) {
              full += evt.content;
              setMsgs(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: full, streaming: true };
                return next;
              });
            }
            if (evt.done || evt.error) {
              setMsgs(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: full || "Sorry, something went wrong.", streaming: false };
                return next;
              });
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMsgs(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: "Sorry, I couldn't connect. Please try again.", streaming: false };
          return next;
        });
      }
    } finally {
      setBusy(false);
      if (!open) setUnread(u => u + 1);
    }
  }, [busy, ensureConversation, open]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <>
      {/* ── Chat panel ── */}
      <div
        className="fixed bottom-24 right-5 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right"
        style={{
          width: open ? 360 : 0,
          height: open ? 560 : 0,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          background: "#ffffff",
          border: "1.5px solid #BFDBFE",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: "linear-gradient(90deg, #0D2565, #1B5CB5)" }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">OmniQure Research Assistant</p>
            <p className="text-blue-200 text-xs">Peptide specialist · Typically replies instantly</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: "#F8FAFF" }}>
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: m.role === "user" ? "#1240A0" : "#EEF4FF", border: m.role === "assistant" ? "1.5px solid #BFD6F8" : "none" }}
              >
                {m.role === "user"
                  ? <User size={13} className="text-white" />
                  : <Bot size={13} style={{ color: "#1240A0" }} />
                }
              </div>
              {/* Bubble */}
              <div
                className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                style={
                  m.role === "user"
                    ? { background: "#1240A0", color: "#fff", borderBottomRightRadius: 6 }
                    : { background: "#fff", color: "#0F172A", border: "1px solid #E2EAF8", borderBottomLeftRadius: 6 }
                }
              >
                {m.content
                  ? m.content.split("\n").map((line, j) => (
                      <span key={j}>{line}{j < m.content.split("\n").length - 1 && <br />}</span>
                    ))
                  : <Loader2 size={14} className="animate-spin opacity-50" />
                }
                {m.streaming && m.content && (
                  <span className="inline-block w-1.5 h-3.5 bg-current opacity-60 animate-pulse ml-0.5 align-middle rounded-sm" />
                )}
              </div>
            </div>
          ))}

          {/* Suggested chips — show only after first welcome message */}
          {msgs.length === 1 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED.map(s => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                  style={{ background: "#EEF4FF", borderColor: "#BFD6F8", color: "#1240A0" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 px-3 py-2.5 border-t" style={{ borderColor: "#E2EAF8", background: "#fff" }}>
          <div className="flex items-end gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "#BFD6F8", background: "#F8FAFF" }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about purity, storage, compatibility…"
              className="flex-1 resize-none bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400 max-h-24"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={() => void send(input)}
              disabled={!input.trim() || busy}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: "#1240A0" }}
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
          <p className="text-center text-xs mt-1.5" style={{ color: "#94A3B8" }}>
            For research enquiries only · Not medical advice
          </p>
        </div>
      </div>

      {/* ── FAB trigger ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #0D2565, #1B5CB5)" }}
        aria-label="Open research chat"
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
