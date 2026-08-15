import React, { useState } from "react";

const STRIPE_ORANGE = "#f39a70";
const CREAM = "#F3EEE2";
const BORDER_COLOR = "#d1cdb8";
const TEXT_DARK = "#334155";

function ShareGlyph({ size = 20, color = TEXT_DARK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 8l5-5 5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ShareButton({ title = "Meme FM", text = "Check this out!", url, onClick }) {
  const [isActive, setIsActive] = useState(false);
  const [btnText, setBtnText] = useState("SHOW IT TO UR MEME NERD");

  const triggerFeedback = (message) => {
    setIsActive(true);
    setBtnText(message);

    setTimeout(() => {
      setIsActive(false);
      setBtnText("SHOW IT TO UR MEME NERD");
    }, 2000);
  };

  const handleShare = async (e) => {
    if (onClick) onClick(e);

    const shareUrl = url || window.location.href;
    const shareData = { title, text, url: shareUrl };

    // Try native device share menu first (mobile / Web Share API)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        triggerFeedback("SHARED!");
      } catch (err) {
        // User cancelled share action
      }
    } else {
      // Fallback: Copy link to clipboard for desktop browsers
      try {
        await navigator.clipboard.writeText(shareUrl);
        triggerFeedback("LINK COPIED!");
      } catch (err) {
        triggerFeedback("COULD NOT COPY");
      }
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "20px auto 0", boxSizing: "border-box" }}>
      <button
        onClick={handleShare}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: isActive ? STRIPE_ORANGE : CREAM,
          color: isActive ? "#FFFFFF" : TEXT_DARK,
          border: isActive ? `1px solid ${STRIPE_ORANGE}` : `1px solid ${BORDER_COLOR}`,
          borderRadius: 10,
          padding: "12px 20px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: 0.5,
          cursor: "pointer",
          boxSizing: "border-box",
          transition: "all 0.15s ease",
          transform: isActive ? "scale(0.98)" : "scale(1)",
        }}
      >
        {btnText}
        <ShareGlyph color={isActive ? "#FFFFFF" : TEXT_DARK} />
      </button>
    </div>
  );
}
