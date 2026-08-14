# Meme FM

A cassette-tape style player for viral meme songs. Built with Next.js + Three.js.

## Folder structure

```
meme-fm/
├─ package.json          → project deps: next, react, three
├─ next.config.js        → minimal Next.js config
├─ data/
│  └─ songs.json         → all 28 songs (title, youtubeId, era, vibeTag, image path)
├─ components/
│  ├─ CassettePlayer.jsx → the 3D cassette + play/prev/next controls
│  ├─ VoronoiBackground.jsx → animated low-opacity background layer
│  └─ Footer.jsx         → ForSure Memes footer placeholder
├─ pages/
│  ├─ _app.js            → loads global CSS
│  └─ index.js           → the actual homepage, assembles everything
├─ public/
│  └─ images/songs/      → drop your cropped 1:1 song photos here
└─ styles/
   └─ globals.css        → base styles + voronoi background animation
```

## Running in Termux

```bash
pkg install nodejs-lts git -y
termux-setup-storage

cd meme-fm
npm install
npm run dev
```

Then open `http://localhost:3000` in your phone's browser — Termux and the
browser share the same device, so no tunneling is needed.

## Editing in Acode

Open the `meme-fm` folder as a project in Acode. Everything you'll touch
day-to-day lives in `data/songs.json` (add/edit songs) and
`public/images/songs/` (drop cropped photos, then set the matching
`"image"` field in songs.json to `/images/songs/yourfile.jpg`).

## Deploying

```bash
git init
git add .
git commit -m "init"
git remote add origin <your-github-repo-url>
git push -u origin main
```

Then import the repo on vercel.com (browser, not Termux) — it auto-deploys
on every push.

## Notes

- `era`, `vibeTag`, and `origin` fields in `songs.json` are draft
  placeholders — replace with the real context you know.
- Song photos: leave `"image": ""` for the initials-placeholder look, or
  point it at a cropped 1:1 file in `public/images/songs/`.
- The voronoi background is CSS-only (no canvas/WebGL cost) — tweak circle
  positions/sizes or animation duration directly in `globals.css`.
