import React, { useState } from "react";

const STRIPE_ORANGE = "#f39a70";
const CREAM = "#F3EEE2";
const BORDER_COLOR = "#d1cdb8";
const TEXT_DARK = "#334155";

function ShareGlyph({ size = 20, color = TEXT_DARK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3V10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 8L12 3L16.5 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 12V18.5A1.5 1.5 0 0 0 6.5 20H17.5A1.5 1.5 0 0 0 19 18.5V12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ShareButton({ title = "Meme FM", text = "bro I found these memes!", url, onClick }) {
  const [isActive, setIsActive] = useState(false);
  const [btnText, setBtnText] = useState("SHOW IT TO YOUR MEME NERD");

  const copyToClipboard = async (textToCopy) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        return true;
      } catch (err) {}
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      return false;
    }
  };

  const handleShare = async (e) => {
    if (onClick) onClick(e);

    const shareUrl = url || window.location.href;
    const shareData = { title, text, url: shareUrl };

    setIsActive(true);
    setBtnText(navigator.share ? "OPENING..." : "LINK COPIED!");

    await new Promise((resolve) => setTimeout(resolve, 200));

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      await copyToClipboard(shareUrl);
    }

    setTimeout(() => {
      setIsActive(false);
      setBtnText("SHOW IT TO YOUR MEME NERD");
    }, 2000);
  };

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "20px auto 0", boxSizing: "border-box" }}>
      <style>{`
        @keyframes shineSweep {
          0% {
            transform: translateX(-120%) skewX(-20deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          32% {
            transform: translateX(220%) skewX(-20deg);
            opacity: 0;
          }
          100% {
            transform: translateX(220%) skewX(-20deg);
            opacity: 0;
          }
        }
        .line-shine::after {
          content: "";
          position: absolute;
          top: -30%;
          left: 0;
          width: 32%;
          height: 160%;
          background: linear-gradient(
            100deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 30%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0.06) 70%,
            transparent 100%
          );
          transform: translateX(-120%) skewX(-20deg);
          animation: shineSweep 5.5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          pointer-events: none;
        }
      `}</style>

      <button
        onClick={handleShare}
        className={!isActive ? "line-shine" : ""}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          position: "relative",
          overflow: "hidden",
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
          textTransform: "uppercase",
          cursor: "pointer",
          boxSizing: "border-box",
          transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease",
          transform: isActive ? "scale(0.98)" : "scale(1)",
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>{btnText}</span>
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center" }}>
          <ShareGlyph color={isActive ? "#FFFFFF" : TEXT_DARK} />
        </div>
      </button>
    </div>
  );
      }
                       
