export default function SiteDisclaimer() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0D2565 0%, #0F2E6B 50%, #0D2565 100%)",
        padding: "48px 16px",
        fontFamily: "'Arimo', Arial, sans-serif",
      }}
    >
      <div
        className="max-w-[860px] mx-auto rounded-2xl p-8 md:p-10"
        style={{
          border: "1.5px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Header */}
        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#E8A93E",
            textTransform: "uppercase",
            marginBottom: "22px",
          }}
        >
          Important — Please Read Before You Order
        </p>

        {/* Intro */}
        <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.80)", lineHeight: 1.75, marginBottom: "18px" }}>
          OmniQure Peptide Research Institute supplies research-grade peptides and reference materials for laboratory use only. By placing an order, you confirm that you have read, understood and agreed to the terms below.
        </p>

        {/* Sections */}
        {[
          {
            label: "For laboratory research use only.",
            body: "All products are sold exclusively for in-vitro laboratory research and analytical purposes. They are not intended — and must not be used — for human or animal consumption, or for any medicinal, therapeutic, diagnostic, clinical, cosmetic or household purpose.",
          },
          {
            label: "Not medicines or consumer products.",
            body: "None of the items we sell are medicines, medical products, supplements, foods or cosmetics. They are not approved for use in or on humans or animals, and they must not be described, marketed or used as such.",
          },
          {
            label: "Eligibility.",
            body: "Our products are intended for qualified researchers and appropriately equipped facilities. By ordering, you confirm that you are at least 18 years old and are purchasing in a professional or research capacity.",
          },
          {
            label: "Your responsibility.",
            body: "You are responsible for ensuring that your purchase, possession and intended use comply with all laws and regulations that apply to you. We give no advice on use and make no representation that any product is fit for any purpose other than laboratory research. OmniQure accepts no liability for any misuse of our products, or for any loss, injury or other outcome arising from their use.",
          },
          {
            label: "Handling & returns.",
            body: "Given the sensitive nature of research materials, returns are limited — please see our Terms & Conditions for how we handle damaged, faulty or quality-related issues.",
          },
        ].map(({ label, body }) => (
          <p key={label} style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "14px" }}>
            <strong style={{ color: "rgba(255,255,255,0.95)", fontWeight: 700 }}>{label}</strong>{" "}
            {body}
          </p>
        ))}

        {/* Closing */}
        <p
          style={{
            fontSize: "12.5px",
            color: "rgba(255,255,255,0.50)",
            fontStyle: "italic",
            marginTop: "6px",
            lineHeight: 1.6,
          }}
        >
          Completing your purchase confirms that you have read and accepted these terms in full.
        </p>
      </div>
    </div>
  );
}
