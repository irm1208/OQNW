import { Link } from "wouter";

export default function AnnouncementBar() {
  return (
    <div
      style={{
        background: "#2A5F5F",
        color: "#FFFFFF",
        textAlign: "center",
        padding: "10px 20px",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.02em",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      15% OFF your first order on single peptides — Use code{" "}
      <strong>FIRST15</strong> at checkout{" "}
      <Link
        href="/all-peptides"
        style={{ color: "#D4E8E8", textDecoration: "underline", textUnderlineOffset: 2, marginLeft: 8 }}
      >
        Shop Now
      </Link>
    </div>
  );
}
