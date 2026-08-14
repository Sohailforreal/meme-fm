

function InstagramGlyph({ size = 20, color = "#F3EEE2" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.6" stroke={color} strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill={color} />
    </svg>
  );
}

export default function Footer() {
  const handleWordmarkClick = (e) => {
    e.preventDefault();
    setTimeout(() => {
      window.open("https://instagram.com/forsure.memes", "_blank", "noopener,noreferrer");
    }, 150); // matches the CSS transition duration below
  };
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "36px auto 0",
        background: "#1E9BE0",
        borderRadius: 14,
        padding: "28px 16px 14px",
        position: "relative",
        minHeight: 150,
        boxSizing: "border-box",
      }}
    >
      <a
        href="https://instagram.com/forsure.memes"
        onClick={handleWordmarkClick}
        className="wordmark-link"
      >
        <img
          src="/images/wordmark.png"
          alt="Forsure Memes — open Instagram"
          style={{
            display: "block",
            maxWidth: "70%",
            height: "auto",
            margin: "0 auto",
            cursor: "pointer",
          }}
        />
      </a>

      <img
        src="/images/logo.png"
        alt="Forsure Memes logo"
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          width: 26,
          height: 26,
          objectFit: "cover", 
        }}
      />

      <div style={{ position: "absolute", bottom: 12, right: 12 }}>
        <InstagramGlyph size={22} color="#F3EEE2" />
      </div>
    </div>
  );
}