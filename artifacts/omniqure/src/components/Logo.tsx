import { Link } from "wouter";

export default function Logo() {
  return (
    <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)",
          borderRadius: "12px",
          padding: "8px 20px 9px",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 4px 18px rgba(18,64,160,0.28), 0 1px 3px rgba(18,64,160,0.2)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Wordmark row */}
        <div style={{ display: "flex", alignItems: "flex-end", lineHeight: 1 }}>
          {/* "omn" */}
          <span
            style={{
              fontFamily: "'Arimo', Arial, sans-serif",
              fontSize: "26px",
              fontWeight: 300,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            omn
          </span>

          {/* "i" with custom dot icon */}
          <span style={{ position: "relative", display: "inline-block" }}>
            {/* The lens / molecule icon above the i */}
            <span
              style={{
                position: "absolute",
                top: "-9px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "12px",
                height: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" stroke="white" strokeWidth="1.2" fill="none" />
                <circle cx="6" cy="6" r="2.2" fill="white" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: "'Arimo', Arial, sans-serif",
                fontSize: "26px",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              i
            </span>
          </span>

          {/* "Qure" — heavier weight */}
          <span
            style={{
              fontFamily: "'Arimo', Arial, sans-serif",
              fontSize: "26px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            Qure
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "'Arimo', Arial, sans-serif",
            fontSize: "7.5px",
            fontWeight: 600,
            color: "#E8A93E",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: "4px",
            whiteSpace: "nowrap",
          }}
        >
          Peptide Research Institute
        </div>
      </div>
    </Link>
  );
}
