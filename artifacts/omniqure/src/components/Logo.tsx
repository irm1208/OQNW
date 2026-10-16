import { Link } from "wouter";

export default function Logo() {
  return (
    <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
      <div
        style={{
          padding: "2px 0",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <img
          src="/omniqure-wordmark-royal-navy.svg"
          alt="OmniQure"
          className="header-logo"
        />
      </div>
    </Link>
  );
}
