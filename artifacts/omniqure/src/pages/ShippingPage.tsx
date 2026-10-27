import { Truck, Shield, Package, Clock, Globe, AlertTriangle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/useSEO";

const LAST_UPDATED = "28 August 2026";
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
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: "32px", height: "32px", backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)", color: "var(--graphite)" }}>
            {icon}
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="font-medium" style={{ fontSize: "13px", color: "var(--cobalt)" }}>{number}.</span>
          <h2 className="font-semibold" style={{ fontSize: "18px", letterSpacing: "-0.01em", color: "var(--ink)" }}>{title}</h2>
        </div>
      </div>
      <div className="pl-2 space-y-3 text-sm leading-relaxed" style={{ color: "var(--graphite)", lineHeight: "1.85" }}>
        {children}
      </div>
    </section>
  );
}

const UK_ZONES: { zone: string; service: string; time: string; price: string }[] = [
  { zone: "UK Mainland",         service: "Tracked Parcel (up to 2kg)",    time: "2–3 business days",  price: "FREE" },
  { zone: "Scotland Highlands",  service: "Tracked Parcel (up to 2kg)",    time: "3–5 business days",  price: "FREE" },
  { zone: "Northern Ireland",    service: "Tracked Parcel (up to 2kg)",    time: "3–5 business days",  price: "FREE" },
  { zone: "Channel Islands & Isle of Man", service: "Tracked International Parcel", time: "3–5 business days", price: "£9.95" },
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
    <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      <PageHero image={{ key: "hdr-shipping", alt: "OmniQure bundle box ready to ship" }} crumbs={[{ label: "Shipping Policy" }]} eyebrow="Delivery" icon={Truck} title="Shipping Policy">
        <p>Last updated: {LAST_UPDATED} · {COMPANY_SHORT}</p>
      </PageHero>

      {/* Key shipping stats */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(11,18,32,0.09)" }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={16} />, label: "Free UK Shipping", value: "Standard tracked service" },
              { icon: <Shield size={16} />, label: "Discreet Dispatch", value: "All orders" },
              { icon: <Package size={16} />, label: "Discreet Packaging", value: "Plain outer box" },
              { icon: <Globe size={16} />, label: "Ships Worldwide", value: "50+ countries" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(11,18,32,0.09)", borderRadius: 16 }}
              >
                <span style={{ color: "var(--graphite)", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p className="font-semibold text-xs" style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}>{item.label}</p>
                  <p className="text-xs" style={{ color: "var(--graphite)" }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10">
        <div
          className="p-6 md:p-8"
          style={{ backgroundColor: "#fff", border: "1px solid rgba(11,18,32,0.09)", borderRadius: 16 }}
        >
          <Section id="processing" number="1" title="Order Processing" icon={<Clock size={15} />}>
            <p>Orders placed before <strong>12:00 noon (GMT/BST)</strong> on business days are typically processed and dispatched the same day. Orders placed after noon or on weekends and UK bank holidays will be dispatched the next available business day.</p>
            <p>You will receive a dispatch confirmation email with a tracking number once your order has been collected by the carrier. Please allow up to 2 hours for tracking information to become active in the carrier's system.</p>
            <p>During peak periods (including promotional events and bank holidays) processing may take an additional 1–2 business days. We will notify you by email if there is a significant delay to your order.</p>
          </Section>

          <Section id="packaging" number="2" title="Packaging & Dispatch" icon={<Package size={15} />}>
            <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)" }}>
              <p className="font-semibold mb-1" style={{ color: "var(--ink)" }}>All {COMPANY_SHORT} orders are dispatched in secure, discreet packaging as standard.</p>
              <p className="text-xs" style={{ color: "var(--graphite)" }}>Lyophilised peptides are stable at room temperature for short transit periods. All shipments are packaged to protect product integrity in transit.</p>
            </div>
            <p>Each order is packaged as follows:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Products are sealed in individual protective vials with tamper-evident caps.",
                "All items are contained in a plain, unbranded outer packaging to ensure discreet delivery.",
                "Full invoice is sent by email only.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "var(--cobalt)", flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p>Upon receipt, lyophilised peptides should be stored at <strong>-20°C</strong> and reconstituted only when required for research. Reconstituted solutions should be stored at 4°C and used within the recommended timeframe.</p>
          </Section>

          <Section id="uk-shipping" number="3" title="UK Domestic Shipping" icon={<Truck size={15} />}>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(11,18,32,0.09)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F2F0EB", borderBottom: "1px solid rgba(11,18,32,0.09)" }}>
                    {["Zone", "Service", "Estimated Time", "Cost"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {UK_ZONES.map((row, i) => (
                    <tr key={row.zone} style={{ borderBottom: i < UK_ZONES.length - 1 ? "1px solid rgba(11,18,32,0.06)" : "none" }}>
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: "var(--ink)" }}>{row.zone}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--graphite)" }}>{row.service}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--graphite)" }}>{row.time}</td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: "var(--ink)" }}>{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs" style={{ color: "var(--graphite)" }}>Free standard tracked shipping applies to UK Mainland, Scotland Highlands, and Northern Ireland. Express services, Channel Islands, and international destinations are charged as listed.</p>
          </Section>

          <Section id="intl-shipping" number="4" title="International Shipping" icon={<Globe size={15} />}>
            <p>We ship to over 50 countries worldwide. All international shipments are sent via tracked international courier services. Estimated delivery times are from dispatch date and may vary due to customs processing times in the destination country.</p>
            <div className="overflow-x-auto rounded-xl mb-3" style={{ border: "1px solid rgba(11,18,32,0.09)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F2F0EB", borderBottom: "1px solid rgba(11,18,32,0.09)" }}>
                    {["Zone", "Countries", "Estimated Time", "Cost"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INTL_ZONES.map((row, i) => (
                    <tr key={row.zone} style={{ borderBottom: i < INTL_ZONES.length - 1 ? "1px solid rgba(11,18,32,0.06)" : "none" }}>
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: "var(--ink)", whiteSpace: "nowrap" }}>{row.zone}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--graphite)" }}>{row.countries}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--graphite)", whiteSpace: "nowrap" }}>{row.time}</td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: "var(--ink)" }}>{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs" style={{ color: "var(--graphite)" }}>Express international shipping may be available for select destinations — contact us prior to ordering.</p>
          </Section>

          <Section id="customs" number="5" title="Customs, Duties & Import Regulations" icon={<AlertTriangle size={15} />}>
            <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)" }}>
              <p className="font-semibold mb-1 flex items-center gap-1.5" style={{ color: "var(--ink)" }}><AlertTriangle size={14} aria-hidden="true" style={{ color: "#D97706" }} />Your responsibility</p>
              <p className="text-xs" style={{ color: "var(--graphite)" }}>It is your sole responsibility to ensure that the importation of research chemicals is legal in your country. {COMPANY_SHORT} accepts no liability for orders seized, delayed, or destroyed by customs authorities.</p>
            </div>
            <p>International orders may be subject to customs duties, import taxes, and handling fees levied by the destination country. These charges are entirely the buyer's responsibility and are not included in our shipping prices.</p>
            <p>We are required by law to accurately describe the contents of all international shipments on customs documentation. We do not falsify customs declarations, mark orders as "gifts," or under-declare values. Any requests to do so will result in cancellation of the order.</p>
            <p>If an order is returned to us by customs, we will contact you to discuss re-shipment (at your cost) or a partial refund (excluding original shipping costs and any return shipping charges we incur).</p>
            <p><strong>Countries we do not currently ship to include:</strong> Russia, Belarus, Iran, North Korea, Israel, and any country subject to comprehensive UK trade sanctions. This list is subject to change.</p>
          </Section>

          <Section id="tracking" number="6" title="Tracking Your Order" icon={<Package size={15} />}>
            <p>All orders are dispatched with full tracking. Your tracking number will be emailed to you at the time of dispatch. You can track your order directly on the carrier's website using this number.</p>
            <p>If you have not received your tracking email within 24 hours of placing your order (and it is a business day), please check your spam folder first. If you still cannot find it, contact us at <a href={`mailto:${EMAIL}`} style={{ color: "var(--cobalt)" }}>{EMAIL}</a>.</p>
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
                  <span style={{ color: "rgba(74,85,104,0.45)", flexShrink: 0 }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
            <p>We will investigate with the carrier and, where a parcel is confirmed lost, offer a replacement shipment or full refund at our discretion. We are unable to investigate lost parcels before these timeframes have elapsed.</p>
          </Section>

          <Section id="contact" number="8" title="Contact">
            <div className="rounded-xl p-4" style={{ backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)" }}>
              <p className="font-semibold mb-2" style={{ color: "var(--ink)" }}>Shipping & Order Enquiries</p>
              <p><strong>Email:</strong> <a href={`mailto:${EMAIL}`} style={{ color: "var(--cobalt)" }}>{EMAIL}</a></p>
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
