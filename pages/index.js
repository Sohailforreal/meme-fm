import VoronoiBackground from "../components/VoronoiBackground";
import CassettePlayer from "../components/CassettePlayer";
import Footer from "../components/Footer";
import songsData from "../data/songs.json";

export default function Home() {
  const songs = songsData.songs;

  return (
    <div className="page-wrap">
      <VoronoiBackground />
      <div className="content" style={{ padding: "32px 16px 40px", maxWidth: 480, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "'Arial Black', Impact, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(48px, 12vw, 88px)",
            letterSpacing: "-2px",
            margin: "0 0 6px",
            lineHeight: 0.9,
            textAlign: "center",
          }}
        >
          MEME FM
        </h1>
        <div
          style={{
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: 0.6,
            marginBottom: 8,
            textAlign: "center",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          viral audio, on tape
        </div>

        <CassettePlayer songs={songs} />
        <Footer />
      </div>
    </div>
  );
}
