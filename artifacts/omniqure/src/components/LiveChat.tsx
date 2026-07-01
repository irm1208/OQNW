import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TAWK.TO LIVE CHAT INTEGRATION
//
// To activate live chat:
//   1. Create a FREE account at https://www.tawk.to
//   2. Add a new Property for your website
//   3. Copy your Property ID and Widget ID from:
//        Dashboard → Administration → Channels → Chat Widget → Direct Chat Link
//      The URL looks like: https://tawk.to/chat/PROPERTY_ID/WIDGET_ID
//   4. Paste them below, replacing the placeholder values.
//
// The Tawk.to mobile app (iOS / Android) lets you respond to chats instantly
// from your phone. The widget appears automatically on every page.
// ─────────────────────────────────────────────────────────────────────────────

const TAWK_PROPERTY_ID = "YOUR_PROPERTY_ID"; // e.g. "64a1b2c3d4e5f60011223344"
const TAWK_WIDGET_ID   = "YOUR_WIDGET_ID";   // e.g. "1h0abcdef"

declare global {
  interface Window {
    Tawk_API?: {
      customize?: (opts: Record<string, unknown>) => void;
      onLoad?: () => void;
      setAttributes?: (attrs: Record<string, string>, cb?: () => void) => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export default function LiveChat() {
  useEffect(() => {
    if (
      TAWK_PROPERTY_ID === "YOUR_PROPERTY_ID" ||
      TAWK_WIDGET_ID === "YOUR_WIDGET_ID"
    ) {
      return;
    }

    if (document.getElementById("tawkto-script")) return;

    window.Tawk_API = window.Tawk_API ?? {};
    window.Tawk_LoadStart = new Date();

    window.Tawk_API.onLoad = function () {
      window.Tawk_API?.setAttributes?.(
        {
          name: "OmniQure Visitor",
          store: "OmniQure Peptide Research Institute",
        },
        function () {}
      );
    };

    const s1 = document.createElement("script");
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0?.parentNode?.insertBefore(s1, s0);

    return () => {};
  }, []);

  return null;
}
