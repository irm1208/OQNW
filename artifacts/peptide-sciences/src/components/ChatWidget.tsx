import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Bot } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const KB: Array<{ patterns: RegExp[]; answer: string }> = [
  {
    patterns: [/hello|hi |hey|good morning|good afternoon|howdy/i],
    answer:
      "Hello! I'm the OmniQure Research Assistant. I can help with questions about our peptides, ordering, shipping, storage, and more. What can I help you with today?",
  },
  {
    patterns: [/purity|hplc|99%|quality|certificate|coa/i],
    answer:
      "Every OmniQure peptide is independently tested using **RP-HPLC** and verified to **≥99% purity**. ESI-TOF mass spectrometry confirms molecular identity. You can download the Certificate of Analysis (COA) directly from each product page — no account required.",
  },
  {
    patterns: [/ship|deliver|dispatch|postage|worldwide|uk|europe|international/i],
    answer:
      "We ship **worldwide via DHL Express**. UK orders typically arrive within 1–2 business days; international orders take 3–5 business days. **Free shipping on all orders over £100**. All orders are dispatched in plain, unmarked packaging.",
  },
  {
    patterns: [/free ship|shipping threshold|£100|100 pounds/i],
    answer:
      "Free shipping is available on all orders over **£100**, for both UK and international destinations. Orders under £100 carry a standard shipping fee.",
  },
  {
    patterns: [/stor|keep|refrigerat|freezer|temper|-20|shelf life/i],
    answer:
      "Most lyophilised peptides should be stored at **−20 °C**, away from light and moisture. When kept sealed in the original vial, shelf life is typically **24+ months**. Avoid repeated freeze-thaw cycles once reconstituted.",
  },
  {
    patterns: [/reconstitut|dissolv|mix|water|buffer|bac water/i],
    answer:
      "Reconstitute with **sterile water or an appropriate buffer** (e.g. 0.9% saline, acetonitrile/water mix) depending on the peptide. Use **bacteriostatic water** if you want to extend the stability of the solution after reconstitution. Always inject the solvent slowly down the side of the vial — avoid vigorous shaking.",
  },
  {
    patterns: [/bpc.?157|bpc157/i],
    answer:
      "**BPC-157** (Body Protection Compound) is a synthetic pentadecapeptide with 15 amino acids. It is widely studied for its role in cellular repair and tissue research. Our BPC-157 is verified to ≥99% HPLC purity. Typical research vials are 5 mg. Store at −20 °C; reconstitute in sterile water or 0.9% saline.",
  },
  {
    patterns: [/tb.?500|thymosin beta/i],
    answer:
      "**TB-500** is the synthetic form of Thymosin Beta-4, a naturally occurring protein involved in actin regulation and cellular migration research. Our TB-500 is HPLC-verified to ≥99% purity. Available in 5 mg vials. Reconstitute in bacteriostatic water.",
  },
  {
    patterns: [/semaglutid/i],
    answer:
      "**Semaglutide** is a GLP-1 receptor agonist peptide researched for its role in metabolic and appetite regulation studies. We supply research-grade semaglutide verified to ≥99% HPLC purity with full COA and mass spectrometry data.",
  },
  {
    patterns: [/tirzepatid/i],
    answer:
      "**Tirzepatide** is a dual GIP/GLP-1 receptor agonist studied in metabolic research. Our tirzepatide is HPLC-verified to ≥99% purity with COA and ESI-MS confirmation available on the product page.",
  },
  {
    patterns: [/epithalon|epitalon/i],
    answer:
      "**Epithalon** (Epitalon) is a tetrapeptide (Ala-Glu-Asp-Gly) researched for its role in telomerase activation studies and cellular aging models. Supplied lyophilised at ≥99% HPLC purity.",
  },
  {
    patterns: [/cjc.?1295|dac/i],
    answer:
      "**CJC-1295** is a GHRH analogue studied for growth hormone secretagogue activity. Available with or without DAC (Drug Affinity Complex). Both variants are HPLC-verified to ≥99% purity with full COA.",
  },
  {
    patterns: [/ipamorelin/i],
    answer:
      "**Ipamorelin** is a selective GHRP (growth hormone-releasing peptide) frequently combined with CJC-1295 in research protocols. Our Ipamorelin is verified to ≥99% HPLC purity.",
  },
  {
    patterns: [/melanotan|pt.?141/i],
    answer:
      "We stock both **Melanotan II** and **PT-141 (Bremelanotide)**, both melanocortin receptor agonists studied in pigmentation and CNS research respectively. Both are HPLC-verified to ≥99% purity.",
  },
  {
    patterns: [/how many peptide|how many product|catalogue|catalog|81|full range|all peptide/i],
    answer:
      "OmniQure stocks **81 research-grade peptides** covering categories including GLP-1 analogues, growth hormone peptides, healing & repair peptides, nootropics, sexual health peptides, and more. Browse the full catalogue at **Shop All Peptides**.",
  },
  {
    patterns: [/price|cost|how much|£|gbp|usd|eur/i],
    answer:
      "Prices vary by peptide and vial size. All prices are shown on individual product pages in GBP, USD, and EUR. We also offer **bundle discounts of up to 20% off** when ordering 3 or more vials. Check the Bundle & Save section for current deals.",
  },
  {
    patterns: [/bundle|bulk|discount|save|3 vial|multiple/i],
    answer:
      "Our **Bundle & Save** programme offers **up to 20% off** when you order 3 or more vials in a single order. Discounts are applied automatically at checkout. You can mix and match different peptides.",
  },
  {
    patterns: [/refer|referral|friend|earn|credit|free peptide/i],
    answer:
      "Our **Refer a Friend** programme lets you earn a **free peptide** (up to £50 value) when a friend signs up using your unique link and places their first order. Your credit is redeemable on your next order. Find your referral link in **My Account → Referrals**.",
  },
  {
    patterns: [/payment|pay|checkout|card|credit card|paypal|crypto|bitcoin/i],
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express). Checkout is SSL-encrypted for security. For further payment options, please contact us at support@omniqure.com.",
  },
  {
    patterns: [/return|refund|cancel|wrong order|damaged/i],
    answer:
      "If you've received a damaged, incorrect, or faulty item, please contact us within **48 hours of delivery** at support@omniqure.com with your order number and photos. We will arrange a replacement or refund promptly.",
  },
  {
    patterns: [/human|vet|animal|consume|inject myself|personal use|for me/i],
    answer:
      "All OmniQure peptides are supplied **strictly for in-vitro laboratory research use only**. They are not approved for human or veterinary administration. By purchasing, you confirm you are a qualified researcher using the compounds in a laboratory setting.",
  },
  {
    patterns: [/legal|customs|import|restriction|country/i],
    answer:
      "Research peptides are legal to purchase in most countries for laboratory research purposes. It is the buyer's responsibility to ensure compliance with local regulations. We ship discreetly in plain, unmarked packaging. For specific country queries, email support@omniqure.com.",
  },
  {
    patterns: [/contact|email|support|help|speak to|talk to|human/i],
    answer:
      "You can reach our team at **support@omniqure.com**. We aim to respond within 24 hours on business days (Monday–Friday, UK hours). For urgent queries, include your order number in the subject line.",
  },
  {
    patterns: [/account|login|register|sign up|sign in|password/i],
    answer:
      "You can create a free account on our website to track orders, manage your wishlist, access your referral link, and view order history. Click **My Account** in the top navigation to get started.",
  },
  {
    patterns: [/gift card|gift voucher/i],
    answer:
      "OmniQure gift cards are available in denominations of £25, £50, and £100, as well as custom amounts. They're delivered electronically and can be used towards any order. Find them in the **Gift Cards** section.",
  },
  {
    patterns: [/track|tracking|where is my order|dispatch/i],
    answer:
      "Once your order has been dispatched, you'll receive a DHL tracking number by email. You can track your parcel at **dhl.com** using that number. If you haven't received a tracking email within 1 business day of ordering, check your spam folder or contact support@omniqure.com.",
  },
  {
    patterns: [/what is a peptide|peptide meaning|define peptide|explain peptide/i],
    answer:
      "A **peptide** is a short chain of amino acids linked by peptide bonds. They are naturally occurring in the body and play roles in signalling, regulation, and repair. Research peptides are synthetic versions used to study these mechanisms in controlled laboratory settings.",
  },
  {
    patterns: [/lyophili|freeze.?dry|powder|vial/i],
    answer:
      "Our peptides are supplied as **lyophilised (freeze-dried) powder** in sealed glass vials. This format maximises shelf life and stability during shipping. You'll need to reconstitute the peptide in an appropriate solvent before use in research.",
  },
  {
    patterns: [/mass spec|esi|ms|spectrometry|molecular weight/i],
    answer:
      "All OmniQure peptides are verified by **ESI-TOF mass spectrometry** to confirm molecular identity and rule out substitution or degradation. The spectral data is published on each product page alongside the HPLC chromatogram.",
  },
  {
    patterns: [/endotoxin|lal|bacterial|sterile/i],
    answer:
      "We perform **LAL (Limulus Amebocyte Lysate) endotoxin testing** on each batch to confirm endotoxin levels are below 1 EU/mg — the threshold required for research-grade compounds.",
  },
  {
    patterns: [/thank|thanks|great|perfect|helpful|awesome/i],
    answer:
      "Happy to help! If you have any other questions about our peptides or anything else, feel free to ask. You can also reach our team at support@omniqure.com.",
  },
];

function getAnswer(input: string): string {
  const q = input.trim();
  for (const entry of KB) {
    if (entry.patterns.some((p) => p.test(q))) {
      return entry.answer;
    }
  }
  return "I'm not sure about that specific question. For detailed assistance, please email our team at **support@omniqure.com** and we'll get back to you within 24 hours. You can also browse our [FAQ page](/faq) for common questions.";
}

function renderMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[(.+)\]\((.+)\)$/);
    if (link) return <a key={i} href={link[2]} style={{ color: "#E8A93E", textDecoration: "underline" }}>{link[1]}</a>;
    return part;
  });
}

let msgId = 0;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: ++msgId,
      role: "assistant",
      text: "Hi! I'm the OmniQure Research Assistant 🔬 Ask me anything about our peptides, shipping, storage, ordering, or research applications.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { id: ++msgId, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      const answer = getAnswer(text);
      setTyping(false);
      setMessages((prev) => [...prev, { id: ++msgId, role: "assistant", text: answer }]);
    }, delay);
  }

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "20px",
            width: "360px",
            maxHeight: "520px",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
            zIndex: 9999,
            overflow: "hidden",
            fontFamily: "'Arimo', Arial, sans-serif",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #0D2565 0%, #1240A0 60%, #1B5CB5 100%)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot size={20} color="#E8A93E" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#fff" }}>OmniQure Research Assistant</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginTop: "1px" }}>
                Peptide research support
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 14px 8px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "#F7F8FB",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    background: m.role === "user"
                      ? "linear-gradient(135deg, #1240A0, #1B5CB5)"
                      : "#fff",
                    color: m.role === "user" ? "#fff" : "#1a1a2e",
                    borderRadius: m.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    padding: "9px 13px",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {renderMarkdown(m.text)}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "10px 14px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#1240A0",
                        display: "inline-block",
                        opacity: 0.4,
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid #E8EAF0",
              background: "#fff",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about peptides, shipping, storage…"
              style={{
                flex: 1,
                border: "1.5px solid #DDE0EA",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "13px",
                outline: "none",
                color: "#1a1a2e",
                background: "#F7F8FB",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: input.trim()
                  ? "linear-gradient(135deg, #1240A0, #1B5CB5)"
                  : "#E8EAF0",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <Send size={15} color={input.trim() ? "#fff" : "#aaa"} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0D2565 0%, #1B5CB5 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(18,64,160,0.45), 0 2px 6px rgba(0,0,0,0.15)",
          zIndex: 9999,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(18,64,160,0.55), 0 2px 8px rgba(0,0,0,0.18)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(18,64,160,0.45), 0 2px 6px rgba(0,0,0,0.15)";
        }}
        title="Research Assistant"
      >
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={24} color="#fff" />}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
