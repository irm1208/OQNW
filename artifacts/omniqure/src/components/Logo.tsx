import { Link } from "wouter";

export default function Logo() {
  return (
    <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)",
          borderRadius: "12px",
          padding: "10px 18px 9px",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow:
            "0 4px 18px rgba(18,64,160,0.28), 0 1px 3px rgba(18,64,160,0.2)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <img
          src="/omniqure-wordmark.png?v=4"
          alt="OmniQure"
          style={{ display: "block", width: "190px", height: "auto" }}
        />
      </div>
    </Link>
  );
}