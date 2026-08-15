import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import VoronoiBackground from "../components/VoronoiBackground";
import CassettePlayer from "../components/CassettePlayer";
import ShareButton from "../components/ShareButton";
import Footer from "../components/Footer";
import songsData from "../data/songs.json";

export default function Home() {
  const router = useRouter();
  const songs = songsData.songs;
  const [currentSong, setCurrentSong] = useState(null);

  // If the URL is /?song=17, start the player on that song instead of #1.
  // Does NOT reorder the list — just picks a different starting index.
  const initialIndex = useMemo(() => {
    const wanted = router.query.song;
    if (!wanted) return 0;
    const found = songs.findIndex((s) => String(s.id) === String(wanted));
    return found >= 0 ? found : 0;
  }, [router.query.song, songs]);

  // Build the link the Share button sends — includes whichever song is
  // currently playing, so the next person opens straight to it.
  const shareUrl =
    typeof window !== "undefined" && currentSong
      ? `${window.location.origin}${window.location.pathname}?song=${currentSong.id}`
      : undefined;

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
          }}
        >
          viral audio, on tape
        </div>

        <CassettePlayer
          songs={songs}
          initialIndex={initialIndex}
          onSongChange={setCurrentSong}
        />
        <ShareButton url={shareUrl} />
        <Footer />
      </div>
    </div>
  );
            }
