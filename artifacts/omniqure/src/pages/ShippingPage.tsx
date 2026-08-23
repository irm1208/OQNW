import { Link } from "wouter";
import { Truck, ChevronRight, Shield, Package, Clock, Globe, AlertTriangle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const LAST_UPDATED = "1 May 2025";
const COMPANY_SHORT = "OmniQure";
const EMAIL = "support@omniqure.com";

interface SectionProps {
  id: string;
  number: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function Section({ id, number, title, icon, children }: SectionProps) {
  return (
    <section id={id} className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: "32px", height: "32px", backgroundColor: "#EEF4FF", color: "#1B5CB5" }}>
            {icon}
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="font-bold" style={{ fontSize: "13px", color: "#1B5CB5" }}>{number}.</span>
          <h2 className="font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>{title}</h2>
        </div>
      </div>
      <div className="pl-2 space-y-3 text-sm leading-relaxed" style={{ color: "#374151", lineHeight: "1.85" }}>
        {children}
      </div>
    </section>
  );
}

const UK_ZONES: { zone: string; service: string; time: string; price: string }[] = [
  { zone: "UK Mainland",         service: "Tracked Parcel (up to 2kg)",    time: "2–3 business days",  price: "£4.99 / Free over £50" },
  { zone: "Scotland Highlands",  service: "Tracked Parcel (up to 2kg)",    time: "3–5 business days",  price: "£7.49" },
  { zone: "Northern Ireland",    service: "Tracked Parcel (up to 2kg)",    time: "3–5 business days",  price: "£7.49" },
  { zone: "Channel Islands",     service: "Tracked International Parcel",  time: "3–5 business days",  price: "£9.95" },
];

const INTL_ZONES: { zone: string; countries: string; time: string; price: string }[] = [
  { zone: "Europe Zone A",  countries: "Germany, France, Netherlands, Belgium, Austria, Ireland, Spain, Italy",  time: "3–7 business days",   price: "£14.99" },
  { zone: "Europe Zone B",  countries: "Poland, Czech Republic, Sweden, Denmark, Norway, Finland, Switzerland",   time: "4–8 business days",   price: "£17.99" },
  { zone: "North America",  countries: "USA, Canada",                                                            time: "5–10 business days",  price: "£22.99" },
  { zone: "Australia & NZ", countries: "Australia, New Zealand",                                                  time: "7–14 business days",  price: "£27.99" },
  { zone: "Asia Pacific",   countries: "Japan, Singapore, Hong Kong, South Korea, Taiwan, Malaysia, Thailand",    time: "7–14 business days",  price: "£23.99" },
  { zone: "Rest of World",  countries: "All other countries where permitted",                                     time: "10–21 business days", price: "£29.99" },
];

export default function ShippingPage() {
  useSEO({
    title: "Shipping Policy",
    description: "OmniQure shipping information — dispatch times, tracked delivery, international shipping, cold-chain packaging for research peptides, and our returns policy.",
    canonicalPath: "/shipping",
  });
  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", padding: "40px 0 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={12} />
            <span style={{ color: "rgba(255,255,255,0.8)" }}>Shipping Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl flex items-center justify-center" style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.12)" }}>
              <Truck size={20} style={{ color: "#93C5FD" }} />
            </div>
            <h1 className="font-bold text-white" style={{ fontSize: "clamp(22px, 4vw, 32px)" }}>
              Shipping Policy
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Last updated: {LAST_UPDATED} · {COMPANY_SHORT}
          </p>
        </div>
      </div>

      {/* Key shipping stats */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={16} />, label: "Free UK Shipping", value: "Orders over £50" },
              { icon: <Shield size={16} />, label: "Discreet Dispatch", value: "All orders" },
              { icon: <Package size={16} />, label: "Discreet Packaging", value: "Plain outer box" },
              { icon: <Globe size={16} />, label: "Ships Worldwide", value: "50+ countries" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}
              >
                <span style={{ color: "#1B5CB5", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p className="font-bold text-xs" style={{ color: "#1240A0" }}>{item.label}</p>
                  <p className="text-xs" style={{ color: "#64748B" }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 16px rgba(15,23,42,0.05)" }}
        >
          <Section id="processing" number="1" title="Order Processing" icon={<Clock size={15} />}>
            <p>Orders placed before <strong>12:00 noon (GMT/BST)</strong> on business days are typically processed and dispatched the same day. Orders placed after noon or on weekends and UK bank holidays will be dispatched the next available business day.</p>
            <p>You will receive a dispatch confirmation email with a tracking number once your order has been collected by the carrier. Please allow up to 2 hours for tracking information to become active in the carrier's system.</p>
            <p>During peak periods (including promotional events and bank holidays) processing may take an additional 1–2 business days. We will notify you by email if there is a significant delay to your order.</p>
          </Section>

          <Section id="packaging" number="2" title="Packaging & Dispatch" icon={<Package size={15} />}>
            <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}>
              <p className="font-semibold mb-1" style={{ color: "#1240A0" }}>All {COMPANY_SHORT} orders are dispatched in secure, discreet packaging as standard.</p>
              <p className="text-xs" style={{ color: "#475569" }}>Lyophilised peptides are stable at room temperature for short transit periods. All shipments are packaged to protect product integrity in transit.</p>
            </div>
            <p>Each order is packaged as follows:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Products are sealed in individual protective vials with tamper-evident caps.",
                "All items are contained in a plain, unbranded outer packaging to ensure discreet delivery.",
                "Full invoice is sent by email only.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#1B5CB5", flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p>Upon receipt, lyophilised peptides should be stored at <strong>-20°C</strong> and reconstituted only when required for research. Reconstituted solutions should be stored at 4°C and used within the recommended timeframe.</p>
          </Section>

          <Section id="uk-shipping" number="3" title="UK Domestic Shipping" icon={<Truck size={15} />}>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #E8EDF5" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E8EDF5" }}>
                    {["Zone", "Service", "Estimated Time", "Cost"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide" style={{ color: "#64748B" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {UK_ZONES.map((row, i) => (
                    <tr key={row.zone} style={{ borderBottom: i < UK_ZONES.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: "#0F172A" }}>{row.zone}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{row.service}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{row.time}</td>
                      <td className="px-4 py-3 text-xs font-bold" style={{ color: "#1240A0" }}>{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs" style={{ color: "#94A3B8" }}>* Free shipping threshold applies to the product subtotal before any discounts or promotions. Tracked service included on all UK orders.</p>
          </Section>

          <Section id="intl-shipping" number="4" title="International Shipping" icon={<Globe size={15} />}>
            <p>We ship to over 50 countries worldwide. All international shipments are sent via tracked international courier services. Estimated delivery times are from dispatch date and may vary due to customs processing times in the destination country.</p>
            <div className="overflow-x-auto rounded-xl mb-3" style={{ border: "1px solid #E8EDF5" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E8EDF5" }}>
                    {["Zone", "Countries", "Estimated Time", "Cost"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide" style={{ color: "#64748B" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INTL_ZONES.map((row, i) => (
                    <tr key={row.zone} style={{ borderBottom: i < INTL_ZONES.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: "#0F172A", whiteSpace: "nowrap" }}>{row.zone}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{row.countries}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#475569", whiteSpace: "nowrap" }}>{row.time}</td>
                      <td className="px-4 py-3 text-xs font-bold" style={{ color: "#1240A0" }}>{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs" style={{ color: "#94A3B8" }}>Express international shipping may be available for select destinations — contact us prior to ordering.</p>
          </Section>

          <Section id="customs" number="5" title="Customs, Duties & Import Regulations" icon={<AlertTriangle size={15} />}>
            <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <p className="font-semibold mb-1" style={{ color: "#92400E" }}>Your responsibility</p>
              <p className="text-xs" style={{ color: "#92400E" }}>It is your sole responsibility to ensure that the importation of research chemicals is legal in your country. {COMPANY_SHORT} accepts no liability for orders seized, delayed, or destroyed by customs authorities.</p>
            </div>
            <p>International orders may be subject to customs duties, import taxes, and handling fees levied by the destination country. These charges are entirely the buyer's responsibility and are not included in our shipping prices.</p>
            <p>We are required by law to accurately describe the contents of all international shipments on customs documentation. We do not falsify customs declarations, mark orders as "gifts," or under-declare values. Any requests to do so will result in cancellation of the order.</p>
            <p>If an order is returned to us by customs, we will contact you to discuss re-shipment (at your cost) or a partial refund (excluding original shipping costs and any return shipping charges we incur).</p>
            <p><strong>Countries we do not currently ship to include:</strong> Russia, Belarus, Iran, North Korea, Israel, and any country subject to comprehensive UK trade sanctions. This list is subject to change.</p>
          </Section>

          <Section id="tracking" number="6" title="Tracking Your Order" icon={<Package size={15} />}>
            <p>All orders are dispatched with full tracking. Your tracking number will be emailed to you at the time of dispatch. You can track your order directly on the carrier's website using this number.</p>
            <p>If you have not received your tracking email within 24 hours of placing your order (and it is a business day), please check your spam folder first. If you still cannot find it, contact us at <a href={`mailto:${EMAIL}`} style={{ color: "#1B5CB5" }}>{EMAIL}</a>.</p>
            <p>Tracking updates may take up to 24 hours to appear in the carrier's system after dispatch, particularly for international shipments where the parcel has not yet been scanned at the destination country's sorting facility.</p>
          </Section>

          <Section id="delays" number="7" title="Delays & Lost Parcels">
            <p>While the vast majority of orders arrive within the estimated timeframes, delays can occasionally occur due to carrier capacity, extreme weather, customs processing, or other factors outside our control.</p>
            <p>If your order has not arrived within the following timeframes from the dispatch date, please contact us:</p>
            <ul className="space-y-1 pl-4">
              {[
                "UK orders: 10 business days",
                "European orders: 20 business days",
                "International orders: 30 business days",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#1B5CB5", flexShrink: 0 }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
            <p>We will investigate with the carrier and, where a parcel is confirmed lost, offer a replacement shipment or full refund at our discretion. We are unable to investigate lost parcels before these timeframes have elapsed.</p>
          </Section>

          <Section id="contact" number="8" title="Contact">
            <div className="rounded-xl p-4" style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}>
              <p className="font-semibold mb-2" style={{ color: "#1240A0" }}>Shipping & Order Enquiries</p>
              <p><strong>Email:</strong> <a href={`mailto:${EMAIL}`} style={{ color: "#1B5CB5" }}>{EMAIL}</a></p>
              <p><strong>Response time:</strong> Within 1 business day</p>
              <p><strong>Hours:</strong> Monday–Friday, 9:00–17:00 GMT/BST</p>
            </div>
            <p>Please include your order number in all correspondence to help us assist you as quickly as possible.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}
