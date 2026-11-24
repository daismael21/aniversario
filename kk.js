const ANNIVERSARY = new Date(2025, 10, 25, 0, 0, 0);

const MEMORIES = [
  {
    src: "fotos/foto11.jpeg",
    title: "El comienzo de todo",
    desc: "Aquí empezó nuestra mejor historia. Nunca voy a olvidar cómo me sentí ese día contigo."
  },
  {
    src: "fotos/foto1.jpeg",
    title: "Mi sonrisa favorita",
    desc: "Esa sonrisa que me alegra hasta los días más pesados."
  },
  {
    src: "fotos/foto3.jpeg",
    title: "Aventuras juntos",
    desc: "No importa el lugar, si estoy contigo siempre es mi plan favorito."
  },
  {
    src: "fotos/foto4.jpeg",
    title: "Risas infinitas",
    desc: "Contigo aprendí que reírse sin parar es la mejor forma de amar."
  },
  {
    src: "fotos/foto5.jpeg",
    title: "Mi lugar seguro",
    desc: "Gracias por apoyarme, escucharme y estar siempre ahí conmigo."
  },
  {
    src: "fotos/foto6.jpeg",
    title: "Un día inolvidable",
    desc: "Si pudiera repetir un día una y otra vez, sin duda elegiría este, para volver a comer mucha pizza jajaja."
  },
  {
    src: "fotos/foto7.jpeg",
    title: "Tu mirada me encanta mi vida",
    desc: "Cada vez que te miro me vuelvo a enamorar como la primera vez."
  },
  {
    src: "fotos/foto8.jpeg",
    title: "Te Amooooooo ❤️",
    desc: "Me encanta todo lo que hemos construido juntos este primer año."
  },
  {
    src: "fotos/foto9.jpeg",
    title: "Mi persona favorita",
    desc: "Eres lo mejor que me pasó y mi mayor motivación todos los días."
  },
  {
    src: "fotos/foto10.jpeg",
    title: "Por muchos años más",
    desc: "Este es solo el primer capítulo de toda una vida juntos. ¡Te amo!"
  }
];

/* =========================================================
   1. UNIVERSO INTERACTIVO EN CANVAS (ESTRELLAS + EXPLOSIONES)
   ========================================================= */
const canvas = document.getElementById("universe-canvas");
const ctx = canvas.getContext("2d");
let W = (canvas.width = window.innerWidth);
let H = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

const pointer = { x: -999, y: -999 };
window.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

const stars = Array.from({ length: 75 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  vx: (Math.random() - 0.5) * 0.28,
  vy: (Math.random() - 0.5) * 0.28,
  r: Math.random() * 1.8 + 0.6
}));

let sparks = [];

function spawnBurst(cx, cy, count = 45) {
  const palette = ["#ff4d79", "#f5c97b", "#ffffff", "#ff8fab"];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = Math.random() * 5.5 + 1.8;
    sparks.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.018 + 0.012,
      color: palette[Math.floor(Math.random() * palette.length)],
      size: Math.random() * 3 + 1.5
    });
  }
}

function renderUniverse() {
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0) s.x = W;
    if (s.x > W) s.x = 0;
    if (s.y < 0) s.y = H;
    if (s.y > H) s.y = 0;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 240, 245, 0.7)";
    ctx.fill();

    const dist = Math.hypot(s.x - pointer.x, s.y - pointer.y);
    if (dist < 130) {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(pointer.x, pointer.y);
      ctx.strokeStyle = `rgba(245, 201, 123, ${(1 - dist / 130) * 0.45})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  sparks = sparks.filter((p) => p.life > 0);
  sparks.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life -= p.decay;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  requestAnimationFrame(renderUniverse);
}
renderUniverse();

/* =========================================================
   2. PORTAL Y MÚSICA (MP3 O CAJA MUSICAL SINTETIZADA)
   ========================================================= */
const portal = document.getElementById("portal");
const igniteBtn = document.getElementById("ignite-btn");
const stage = document.getElementById("stage");
const bgAudio = document.getElementById("bg-audio");
const vinylToggle = document.getElementById("vinyl-toggle");
const vinylDisc = document.getElementById("vinyl-disc");
const vinylStatus = document.getElementById("vinyl-status");
const eqBars = document.getElementById("eq-bars");

let synthPlaying = false;
let synthTimer = null;

function startMusicBox() {
  if (synthPlaying) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const actx = new AudioCtx();
  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.0, 783.99];
  let step = 0;
  synthPlaying = true;
  vinylDisc.classList.add("spinning");
  eqBars.classList.add("active");
  vinylStatus.textContent = "Melodía activa";

  synthTimer = setInterval(() => {
    if (!synthPlaying) return;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = "sine";
    osc.frequency.value = notes[step % notes.length];
    gain.gain.setValueAtTime(0.04, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.9);
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + 0.92);
    step++;
  }, 650);
}

function stopAllAudio() {
  bgAudio.pause();
  synthPlaying = false;
  clearInterval(synthTimer);
  vinylDisc.classList.remove("spinning");
  eqBars.classList.remove("active");
  vinylStatus.textContent = "En pausa";
}

function playExperienceAudio() {
  bgAudio.play().then(() => {
    vinylDisc.classList.add("spinning");
    eqBars.classList.add("active");
    vinylStatus.textContent = "Reproduciendo";
  }).catch(() => {
    startMusicBox();
  });
}

igniteBtn.addEventListener("click", (e) => {
  const rect = igniteBtn.getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
  portal.classList.add("vanish");
  stage.classList.remove("hidden");
  playExperienceAudio();

  setTimeout(() => {
    portal.classList.add("hidden");
    initScratchCard();
    revealSections();
  }, 650);
});

vinylToggle.addEventListener("click", () => {
  if (!bgAudio.paused || synthPlaying) {
    stopAllAudio();
  } else {
    playExperienceAudio();
  }
});

document.getElementById("fireworks-btn").addEventListener("click", () => {
  spawnBurst(W * 0.3, H * 0.35, 45);
  setTimeout(() => spawnBurst(W * 0.7, H * 0.28, 45), 220);
});

/* =========================================================
   3. CRONÓMETRO EN TIEMPO REAL
   ========================================================= */
function updateChrono() {
  const diff = Math.max(0, new Date() - ANNIVERSARY);
  document.getElementById("c-days").textContent = Math.floor(diff / 86400000);
  document.getElementById("c-hours").textContent = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
  document.getElementById("c-mins").textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
  document.getElementById("c-secs").textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
}
setInterval(updateChrono, 1000);
updateChrono();

/* =========================================================
   4. PROYECTOR 3D + POLAROIDS + MODO PELÍCULA
   ========================================================= */
let index = 0;
let movieInterval = null;
let progressTimer = null;

const mainPhoto = document.getElementById("main-photo");
const mainTitle = document.getElementById("main-title");
const mainDesc = document.getElementById("main-desc");
const counterTag = document.getElementById("photo-counter-tag");
const pillsWrap = document.getElementById("story-pills");
const polaroidStrip = document.getElementById("polaroid-strip");
const progressFill = document.getElementById("movie-progress-fill");
const autoplayBtn = document.getElementById("autoplay-btn");

MEMORIES.forEach((mem, idx) => {
  const pill = document.createElement("button");
  pill.className = "story-pill" + (idx === 0 ? " active" : "");
  pill.addEventListener("click", () => selectMemory(idx));
  pillsWrap.appendChild(pill);

  const pol = document.createElement("div");
  pol.className = "mini-polaroid" + (idx === 0 ? " active" : "");
  pol.style.setProperty("--rot", `${(idx % 2 === 0 ? -1 : 1) * 3}deg`);
  pol.innerHTML = `<img src="${mem.src}" alt="${mem.title}" loading="lazy" />`;
  pol.addEventListener("click", () => selectMemory(idx));
  polaroidStrip.appendChild(pol);
});

const pills = Array.from(pillsWrap.children);
const polaroids = Array.from(polaroidStrip.children);

function selectMemory(idx) {
  index = (idx + MEMORIES.length) % MEMORIES.length;
  const item = MEMORIES[index];

  mainPhoto.style.opacity = "0.2";
  mainPhoto.style.transform = "scale(0.97)";
  setTimeout(() => {
    mainPhoto.src = item.src;
    mainPhoto.alt = item.title;
    mainPhoto.style.opacity = "1";
    mainPhoto.style.transform = "scale(1)";
  }, 160);

  mainTitle.textContent = item.title;
  mainDesc.textContent = item.desc;
  counterTag.textContent = `${String(index + 1).padStart(2, "0")} / ${MEMORIES.length}`;

  pills.forEach((p, i) => p.classList.toggle("active", i === index));
  polaroids.forEach((p, i) => p.classList.toggle("active", i === index));
  polaroids[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

document.getElementById("prev-mem").addEventListener("click", () => selectMemory(index - 1));
document.getElementById("next-mem").addEventListener("click", () => selectMemory(index + 1));

// Modo Película Automático
autoplayBtn.addEventListener("click", () => {
  if (movieInterval) {
    clearInterval(movieInterval);
    clearInterval(progressTimer);
    movieInterval = null;
    progressFill.style.width = "0%";
    autoplayBtn.textContent = "▶ Modo Película";
    autoplayBtn.classList.remove("playing");
  } else {
    autoplayBtn.textContent = "⏸ Pausar";
    autoplayBtn.classList.add("playing");
    let pct = 0;
    progressTimer = setInterval(() => {
      pct += 2.5;
      progressFill.style.width = `${Math.min(100, pct)}%`;
    }, 100);
    movieInterval = setInterval(() => {
      pct = 0;
      selectMemory(index + 1);
    }, 4000);
  }
});

// Efecto 3D Tilt en la tarjeta
const tiltCard = document.getElementById("tilt-card");
const glare = document.getElementById("card-glare");

tiltCard.addEventListener("pointermove", (e) => {
  const rect = tiltCard.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  tiltCard.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  glare.style.opacity = "1";
  glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.16), transparent 60%)`;
});

tiltCard.addEventListener("pointerleave", () => {
  tiltCard.style.transform = "rotateY(0deg) rotateX(0deg)";
  glare.style.opacity = "0";
});

// Visor pantalla completa
const modal = document.getElementById("immersive-modal");
document.getElementById("fullscreen-trigger").addEventListener("click", () => {
  const item = MEMORIES[index];
  document.getElementById("immersive-img").src = item.src;
  document.getElementById("immersive-title").textContent = item.title;
  document.getElementById("immersive-desc").textContent = item.desc;
  modal.classList.remove("hidden");
});
document.getElementById("close-immersive").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

/* =========================================================
   5. TARJETA "RASPA Y DESCUBRE" EN CANVAS
   ========================================================= */
function initScratchCard() {
  const sCanvas = document.getElementById("scratch-canvas");
  const box = document.getElementById("scratch-box");
  sCanvas.width = box.offsetWidth;
  sCanvas.height = box.offsetHeight;
  const sCtx = sCanvas.getContext("2d");

  const grad = sCtx.createLinearGradient(0, 0, sCanvas.width, sCanvas.height);
  grad.addColorStop(0, "#d4a359");
  grad.addColorStop(0.5, "#f7dc9c");
  grad.addColorStop(1, "#b88234");
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);

  sCtx.fillStyle = "#2b1d08";
  sCtx.font = "700 15px 'Plus Jakarta Sans', sans-serif";
  sCtx.textAlign = "center";
  sCtx.fillText("✨ RASPA AQUÍ CON TU DEDO ✨", sCanvas.width / 2, sCanvas.height / 2 + 5);

  let scratching = false;
  let celebrated = false;

  function scratchAt(e) {
    if (!scratching) return;
    const rect = sCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    sCtx.globalCompositeOperation = "destination-out";
    sCtx.beginPath();
    sCtx.arc(x, y, 24, 0, Math.PI * 2);
    sCtx.fill();

    if (!celebrated) {
      celebrated = true;
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
    }
  }

  sCanvas.addEventListener("pointerdown", (e) => { scratching = true; scratchAt(e); });
  window.addEventListener("pointerup", () => { scratching = false; });
  sCanvas.addEventListener("pointermove", scratchAt);
  sCanvas.addEventListener("touchstart", (e) => { scratching = true; scratchAt(e); }, { passive: true });
  sCanvas.addEventListener("touchmove", scratchAt, { passive: true });
}

/* =========================================================
   6. REVELACIÓN AL HACER SCROLL
   ========================================================= */
function revealSections() {
  document.querySelectorAll(".reveal-block").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 40) {
      el.classList.add("in-view");
    }
  });
}
window.addEventListener("scroll", revealSections);