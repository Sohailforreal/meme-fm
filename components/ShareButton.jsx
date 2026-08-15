const STRIPE_ORANGE = "#f39a70";
const CREAM = "#F3EEE2";

function ShareGlyph({ size = 20, color = CREAM }) {
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

export default function ShareButton({ onClick }) {
  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "20px auto 0", boxSizing: "border-box" }}>
      <button
        onClick={onClick}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: STRIPE_ORANGE,
          color: CREAM,
          border: "none",
          borderRadius: 14,
          padding: "16px 20px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: 14,
          letterSpacing: 1,
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        SHOW IT TO UR MEME NERD
        <ShareGlyph />
      </button>
    </div>
  );
}

