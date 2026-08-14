import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

const INK = "#141210";
const CREAM = "#F3EEE2";
const SHELL = "#17140F";
const STRIPE_ORANGE = "#E7532A";
const STRIPE_TAN = "#C79A5E";
const BASE_PHOTO_COLOR = "#6B5B45";
const GRADIENT_STOPS = ["#3A3630", "#161310", "#0A0908"];

function makeLabelTexture(song) {
  const w = 1024, h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

ctx.fillStyle = CREAM;
roundRectPath(ctx, 0, 0, w, h, 40);
ctx.fill();

ctx.strokeStyle = INK;
ctx.lineWidth = 6;
roundRectPath(ctx, 10, 10, w - 20, h - 20, 32);
ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(60, 40);
  ctx.lineTo(190, 40);
  ctx.lineTo(190, 130);
  ctx.lineTo(60, 170);
  ctx.closePath();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = INK;
  let title = song.title;
  ctx.font = "600 44px 'DM Sans', sans-serif";
  while (ctx.measureText(title).width > 760 && title.length > 4) {
    title = title.slice(0, -1);
  }
  if (title !== song.title) title = title.trim() + "…";
  ctx.textAlign = "center";
  const textX = w/2, textY = 130;
  ctx.fillText(title, textX, textY);


  const stripeY = 260, stripeH = 130;
  let sy = stripeY;
  ctx.fillStyle = STRIPE_ORANGE;
  ctx.fillRect(60, sy, w - 120, 26);
  sy += 26;
  ctx.fillStyle = STRIPE_TAN;
  ctx.fillRect(60, sy, w - 120, stripeH - 26);

  ctx.fillStyle = INK;
  ctx.font = "22px monospace";
  ctx.fillText("100", 420, stripeY + stripeH + 30);
  ctx.fillText("50", 500, stripeY + stripeH + 30);
  ctx.fillText("0", 565, stripeY + stripeH + 30);
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const x = 400 + i * 16;
    ctx.moveTo(x, stripeY + stripeH + 4);
    ctx.lineTo(x, stripeY + stripeH + 14);
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makePlaceholderPhotoTexture(initials) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2, cy = size / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = BASE_PHOTO_COLOR;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.fillStyle = "#F3EEE2";
  ctx.font = "bold 140px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, cx, cy + 10);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createRoundedBoxGeometry(width, height, depth, radius, smoothness = 4) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = radius;

  shape.moveTo(x, y + r);
  shape.lineTo(x, y + h - r);
  shape.quadraticCurveTo(x, y + h, x + r, y + h);
  shape.lineTo(x + w - r, y + h);
  shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
  shape.lineTo(x + w, y + r);
  shape.quadraticCurveTo(x + w, y, x + w - r, y);
  shape.lineTo(x + r, y);
  shape.quadraticCurveTo(x, y, x, y + r);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: radius * 0.4,
    bevelSize: radius * 0.4,
    bevelSegments: smoothness,
    curveSegments: smoothness,
  });
  geometry.center();
  return geometry;
}



function makeSpoolTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2, cy = size / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = "#2A2A2A";
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.strokeStyle = "#4A4A4A";
  ctx.lineWidth = 10;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * size * 0.42, cy + Math.sin(a) * size * 0.42);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// tintColor: optional THREE.Color extracted from the current song's photo.
// When present, the shell gradient is built from it instead of the default
// stops, so the cassette body picks up the photo's dominant color.
function makeShellGradientTexture(tintColor) {
  const w = 512, h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, w, h);

  if (tintColor) {
    const light = tintColor.clone().lerp(new THREE.Color(0xffffff), 0.35);
    const mid = tintColor.clone();
    const dark = tintColor.clone().lerp(new THREE.Color(0x000000), 0.65);
    grad.addColorStop(0, `#${light.getHexString()}`);
    grad.addColorStop(0.55, `#${mid.getHexString()}`);
    grad.addColorStop(1, `#${dark.getHexString()}`);
  } else {
    grad.addColorStop(0, GRADIENT_STOPS[0]);
    grad.addColorStop(0.55, GRADIENT_STOPS[1]);
    grad.addColorStop(1, GRADIENT_STOPS[2]);
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makeBackdropTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // soft radial glow, center brighter, edges fading to transparent
  const grad = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  grad.addColorStop(0, "rgba(20,18,16,0.10)");
  grad.addColorStop(1, "rgba(20,18,16,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // faint grain on top for texture
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10;
    imgData.data[i] += noise;
    imgData.data[i + 1] += noise;
    imgData.data[i + 2] += noise;
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}



// Crops the texture (via UV repeat/offset) to fill a square container
// without distortion — same idea as CSS `object-fit: cover`. Without this,
// a non-square photo gets stretched to fit the circle, and any white
// margin/background in the source photo shows through unevenly.
function applyCoverUV(texture, containerAspect = 1) {
  const img = texture.image;
  if (!img || !img.width || !img.height) return;
  const imgAspect = img.width / img.height;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  if (imgAspect > containerAspect) {
    const scale = containerAspect / imgAspect;
    texture.repeat.set(scale, 1);
    texture.offset.set((1 - scale) / 2, 0);
  } else {
    const scale = imgAspect / containerAspect;
    texture.repeat.set(1, scale);
    texture.offset.set(0, (1 - scale) / 2);
  }
  texture.needsUpdate = true;
}

// Downsamples the image to a tiny canvas and averages the opaque pixels to
// get a representative "dominant color" for tinting the cassette shell.
function getDominantColor(img) {
  const size = 16;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, size, size);
  let data;
  try {
    data = ctx.getImageData(0, 0, size, size).data;
  } catch (e) {
    return null; // e.g. tainted canvas from a cross-origin image
  }
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 10) continue;
    r += data[i]; g += data[i + 1]; b += data[i + 2];
    count++;
  }
  if (!count) return null;
  return new THREE.Color(
    `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
  );
}

// ---------- YouTube IFrame API loader (loaded once, shared) ----------
let ytApiPromise = null;
function loadYouTubeAPI() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevCallback === "function") prevCallback();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

export default function CassettePlayer({ songs }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const song = songs[index];

  const dragState = useRef({
    dragging: false, lastX: 0, lastY: 0, lastT: 0,
    downX: 0, downY: 0, downT: 0, vx: 0, vy: 0,
  });
  const hoverRef = useRef({ x: 0, y: 0 });
  const inertiaRef = useRef({ vx: 0, vy: 0 });
  const bounceRef = useRef({ start: 0, active: false });

  // Cache of decoded photo textures + their extracted dominant color, keyed
  // by image URL. Switching back to a song you've already viewed reuses the
  // already-decoded GPU texture instead of re-downloading and re-decoding
  // the image every time — this is the "memory allocation" for photos.
  // Entries are disposed only when the component unmounts, not on every
  // song switch.
  const textureCacheRef = useRef(new Map());

  // ---------- Double-buffered YouTube audio players ----------
  // One player is "active" (playing/paused, what the user hears), the other
  // is "standby" and sits pre-loaded with the NEXT track so that calling
  // next() is an instant swap instead of a fresh iframe/page load.
  const playerARef = useRef(null);
  const playerBRef = useRef(null);
  const activeKeyRef = useRef("A"); // "A" | "B"
  const indexRef = useRef(0);
  const songsRef = useRef(songs);

  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { songsRef.current = songs; }, [songs]);
  useEffect(() => {
  const ua = navigator.userAgent;
  const isInstagramBrowser = ua.includes("Instagram");
  const isAndroid = /Android/i.test(ua);

  if (isInstagramBrowser && isAndroid) {
    window.location.href =
      "intent://" + window.location.host + window.location.pathname +
      "#Intent;scheme=https;package=com.android.chrome;end";
  }
}, []);
  const getActivePlayer = () =>
    activeKeyRef.current === "A" ? playerARef.current : playerBRef.current;
  const getStandbyPlayer = () =>
    activeKeyRef.current === "A" ? playerBRef.current : playerARef.current;

  const advance = useCallback((direction) => {
    const list = songsRef.current;
    const nextIndex = (indexRef.current + direction + list.length) % list.length;

    if (direction === 1) {
      // Forward: the standby player already has this track pre-loaded — just swap.
      const standby = getStandbyPlayer();
      const nowInactive = getActivePlayer();
      activeKeyRef.current = activeKeyRef.current === "A" ? "B" : "A";
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      setPlaying(true);
      if (standby && typeof standby.playVideo === "function") {
        standby.playVideo();
      }
      // Pre-load the track after that into the now-inactive player, paused.
      const upcoming = list[(nextIndex + 1) % list.length];
      if (nowInactive && typeof nowInactive.cueVideoById === "function" && upcoming) {
        nowInactive.cueVideoById(upcoming.youtubeId);
      }
    } else {
      // Backward: no pre-buffered player for "previous", load directly.
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      setPlaying(true);
      const active = getActivePlayer();
      const target = list[nextIndex];
      if (active && typeof active.loadVideoById === "function" && target) {
        active.loadVideoById(target.youtubeId);
      }
      // Re-sync standby to hold the (new) next track.
      const standby = getStandbyPlayer();
      const upcoming = list[(nextIndex + 1) % list.length];
      if (standby && typeof standby.cueVideoById === "function" && upcoming) {
        standby.cueVideoById(upcoming.youtubeId);
      }
    }
  }, []);

  const next = useCallback(() => advance(1), [advance]);
  const prev = useCallback(() => advance(-1), [advance]);
  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  // Create the two persistent YouTube players once on mount.
  useEffect(() => {
    let cancelled = false;
    const hostA = document.createElement("div");
    const hostB = document.createElement("div");
    hostA.style.display = "none";
    hostB.style.display = "none";
    document.body.appendChild(hostA);
    document.body.appendChild(hostB);

    const onStateChangeFor = (key) => (event) => {
      // YT.PlayerState.ENDED === 0
      if (event.data === 0 && activeKeyRef.current === key) {
        advance(1);
      }
    };

    loadYouTubeAPI().then((YT) => {
  if (!YT || cancelled) return;
  const list = songsRef.current;
  const first = list[0];
  const second = list[1 % list.length];

  playerARef.current = new YT.Player(hostA, {
    videoId: first?.youtubeId,
    playerVars: { autoplay: 0, controls: 0, playsinline: 1, disablekb: 1 },
    events: {
      onStateChange: onStateChangeFor("A"),
      onReady: () => {
        if (cancelled) return;
        playerARef.current.setPlaybackQuality('tiny');
        playerBRef.current = new YT.Player(hostB, {
          videoId: second?.youtubeId,
          playerVars: { autoplay: 0, controls: 0, playsinline: 1, disablekb: 1 },
          events: {
            onStateChange: onStateChangeFor("B"),
            onReady: () => {
              playerBRef.current.setPlaybackQuality('tiny');
            },
          },
        });
      },
    },
  });
});

    return () => {
      cancelled = true;
      try { playerARef.current?.destroy?.(); } catch (e) {}
      try { playerBRef.current?.destroy?.(); } catch (e) {}
      hostA.remove();
      hostB.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive play/pause on whichever player is currently active.
  useEffect(() => {
    const active = getActivePlayer();
    if (!active || typeof active.playVideo !== "function") return;
    if (playing) active.playVideo();
    else active.pauseVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  // ---------- Three.js scene ----------
  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0xffffff, 0.35);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    const group = new THREE.Group();
    group.scale.set(0.92, 0.92, 0.92);
    
    const backdropGeo = new THREE.PlaneGeometry(6, 6);
const backdropMat = new THREE.MeshBasicMaterial({
  map: makeBackdropTexture(),
  transparent: true,
  depthWrite: false,
});
const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
backdrop.position.z = -1.2;
scene.add(backdrop);
    
    
    
    scene.add(group);

    const gradientTex = makeShellGradientTexture();
    const frontMat = new THREE.MeshStandardMaterial({ map: gradientTex, roughness: 0.5, metalness: 0.25 });
    const sideMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(SHELL), roughness: 0.65, metalness: 0.12 });
    const bodyGeo = createRoundedBoxGeometry(3.6, 2.2, 0.3, 0.15);
    const body = new THREE.Mesh(bodyGeo, [frontMat, sideMat]);
    group.add(body);
    const labelGeo = new THREE.PlaneGeometry(3.2, 1.7);
    const labelMat = new THREE.MeshBasicMaterial({ map: makeLabelTexture(song), transparent: true });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.z = 0.225;
    group.add(label);

    const reelGeo = new THREE.CircleGeometry(0.42, 40);
    const leftMat = new THREE.MeshBasicMaterial({ map: makePlaceholderPhotoTexture(song.initials), transparent: true });
    const rightMat = new THREE.MeshBasicMaterial({ map: makeSpoolTexture() });
    const leftReel = new THREE.Mesh(reelGeo, leftMat);
    leftReel.position.set(-0.78, -0.02, 0.235);
    const rightReel = new THREE.Mesh(reelGeo, rightMat);
    rightReel.position.set(0.78, -0.02, 0.235);
    group.add(leftReel, rightReel);

    const ridgeGeo = new THREE.BoxGeometry(3.6, 0.4, 0.32);
    const ridgeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(SHELL), roughness: 0.8 });
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridge.position.y = -1.3;
    group.add(ridge);
    const holeGeo = new THREE.CircleGeometry(0.09, 20);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
    [-1.2, -0.4, 0.4, 1.2].forEach((x) => {
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.position.set(x, -1.3, 0.235);
      group.add(hole);
    });

    sceneRef.current = { scene, camera, renderer, group, leftReel, rightReel, label, frontMat, mount };

    let raf, t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.016;

      if (!dragState.current.dragging) {
        const inertia = inertiaRef.current;
        const moving = Math.abs(inertia.vx) > 0.0002 || Math.abs(inertia.vy) > 0.0002;
        if (moving) {
          group.rotation.y += inertia.vx;
          group.rotation.x += inertia.vy;
          inertia.vx *= 0.93;
          inertia.vy *= 0.93;
        } else {
          const targetY = Math.sin(t * 0.4) * 0.16 + hoverRef.current.x * 0.18;
          const targetX = Math.sin(t * 0.3) * 0.03 + hoverRef.current.y * 0.1;
          group.rotation.y += (targetY - group.rotation.y) * 0.04;
          group.rotation.x += (targetX - group.rotation.x) * 0.04;
        }
      }

      if (bounceRef.current.active) {
        const p = Math.min((performance.now() - bounceRef.current.start) / 320, 1);
        const s = 0.92 + Math.sin(p * Math.PI) * 0.07;
        group.scale.set(s, s, s);
        if (p >= 1) { bounceRef.current.active = false; group.scale.set(0.92, 0.92, 0.92); }
      }

      if (sceneRef.current.playing) {
        leftReel.rotation.z -= 0.05;
        rightReel.rotation.z -= 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ---------- Pointer handling ----------
    // Only pointer events are used now (they already cover touch, mouse, and
    // pen). The old code ALSO listened for touchstart/touchmove/touchend on
    // the same element, so every touch move fired twice through two slightly
    // different coordinate streams — that double-update is what made pinch
    // feel like it was spinning the model erratically. Multi-touch is now
    // explicitly ignored so a second finger can never feed a rotation delta.
    const isMultiTouch = (e) => e.touches && e.touches.length > 1;

    const onDown = (e) => {
      if (isMultiTouch(e)) {
        dragState.current.dragging = false;
        inertiaRef.current = { vx: 0, vy: 0 };
        return;
      }
      const p = e.touches ? e.touches[0] : e;
      const ds = dragState.current;
      ds.dragging = true;
      ds.lastX = ds.downX = p.clientX;
      ds.lastY = ds.downY = p.clientY;
      ds.lastT = ds.downT = performance.now();
      inertiaRef.current = { vx: 0, vy: 0 };
    };
    const onMove = (e) => {
      if (isMultiTouch(e)) {
        dragState.current.dragging = false;
        return;
      }
      const p = e.touches ? e.touches[0] : e;
      if (!dragState.current.dragging) {
        const rect = mount.getBoundingClientRect();
        hoverRef.current.x = ((p.clientX - rect.left) / rect.width - 0.5) * 2;
        hoverRef.current.y = ((p.clientY - rect.top) / rect.height - 0.5) * 2;
        return;
      }
      const ds = dragState.current;
      const now = performance.now();
      const dx = p.clientX - ds.lastX;
      const dy = p.clientY - ds.lastY;
      const dt = Math.max(now - ds.lastT, 1);
      group.rotation.y += dx * 0.008;
      group.rotation.x += dy * 0.006;
      ds.vx = (dx * 0.008) * (16 / dt);
      ds.vy = (dy * 0.006) * (16 / dt);
      ds.lastX = p.clientX;
      ds.lastY = p.clientY;
      ds.lastT = now;
    };
    const onUp = (e) => {
      const ds = dragState.current;
      if (e && e.touches && e.touches.length > 0) {
        // A finger lifted but at least one remains (tail end of a pinch) —
        // just stop dragging, don't treat this as a normal release.
        ds.dragging = false;
        return;
      }
      if (!ds.dragging) return;
      ds.dragging = false;
      const dist = Math.hypot(ds.lastX - ds.downX, ds.lastY - ds.downY);
      const dur = performance.now() - ds.downT;
      if (dist < 6 && dur < 300) {
        bounceRef.current = { start: performance.now(), active: true };
      } else {
        inertiaRef.current = { vx: ds.vx, vy: ds.vy };
      }
    };

    mount.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      mount.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      mount.removeChild(renderer.domElement);
      bodyGeo.dispose();
      labelGeo.dispose();
      reelGeo.dispose();

      backdropGeo.dispose();
      backdropMat.map.dispose();
      backdropMat.dispose();

      if (frontMat.map) frontMat.map.dispose();
      frontMat.dispose();
      sideMat.dispose();
      if (labelMat.map) labelMat.map.dispose();
      labelMat.dispose();
      leftMat.dispose();
      rightMat.dispose();
      ridgeGeo.dispose();
      ridgeMat.dispose();
      holeGeo.dispose();
      holeMat.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const s = sceneRef.current;
    if (!s.label) return;
    s.label.material.map.dispose();
    s.label.material.map = makeLabelTexture(song);
    s.label.material.needsUpdate = true;

    // The reel's current map might be a cached texture we don't own the
    // lifecycle of anymore — only dispose it here if it's NOT sitting in
    // the cache (e.g. it was a one-off placeholder).
    const disposeIfUncached = (tex) => {
      if (!tex) return;
      for (const entry of textureCacheRef.current.values()) {
        if (entry.texture === tex) return; // still owned by the cache, keep it
      }
      tex.dispose();
    };

    const applyPhoto = (tex, dominantColor) => {
      disposeIfUncached(s.leftReel.material.map);
      s.leftReel.material.map = tex;
      s.leftReel.material.needsUpdate = true;

      if (s.frontMat) {
        if (s.frontMat.map) s.frontMat.map.dispose();
        s.frontMat.map = makeShellGradientTexture(dominantColor || null);
        s.frontMat.needsUpdate = true;
      }
    };

    const applyPlaceholder = () => {
      disposeIfUncached(s.leftReel.material.map);
      s.leftReel.material.map = makePlaceholderPhotoTexture(song.initials);
      s.leftReel.material.needsUpdate = true;

      if (s.frontMat) {
        if (s.frontMat.map) s.frontMat.map.dispose();
        s.frontMat.map = makeShellGradientTexture(null); // default gradient
        s.frontMat.needsUpdate = true;
      }
    };

    if (!song.image) {
      applyPlaceholder();
      return;
    }

    const cached = textureCacheRef.current.get(song.image);
    if (cached) {
      applyPhoto(cached.texture, cached.dominantColor);
      return;
    }

    let cancelled = false;
    new THREE.TextureLoader().load(
      song.image,
      (tex) => {
        if (cancelled) { tex.dispose(); return; } // user already moved on
        applyCoverUV(tex, 1);
        tex.colorSpace = THREE.SRGBColorSpace;
        const dominantColor = getDominantColor(tex.image);
        textureCacheRef.current.set(song.image, { texture: tex, dominantColor });
        applyPhoto(tex, dominantColor);
      },
      undefined,
      () => {
        if (cancelled) return;
        applyPlaceholder();
      }
    );

    return () => { cancelled = true; };
  }, [index, song]);

  // Dispose every cached photo texture when the whole player unmounts.
  useEffect(() => {
    const cache = textureCacheRef.current;
    return () => {
      for (const entry of cache.values()) entry.texture.dispose();
      cache.clear();
    };
  }, []);

  useEffect(() => {
    sceneRef.current.playing = playing;
  }, [playing]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        ref={mountRef}
        style={{ width: "100%", maxWidth: 420, height: 340, touchAction: "none", cursor: "grab" }}
      />

      <div style={{ textAlign: "center", marginTop: 20, maxWidth: 420 }}>
        <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "'Instrument Serif', serif" }}>{song.title}</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>
          {song.vibeTag}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 24 }}>
        <button onClick={prev} style={btnStyle}>⏮</button>
        <button onClick={togglePlay} style={{ ...btnStyle, background: INK, color: CREAM, width: 64, height: 64, fontSize: 22 }}>
          {playing ? "❚❚" : "▶"}
        </button>
        <button onClick={next} style={btnStyle}>⏭</button>
      </div>
    </div>
  );
}

const btnStyle = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: `2px solid ${INK}`,
  background: CREAM,
  color: INK,
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
