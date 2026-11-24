// 1. FECHA EXACTA DE INICIO: 25 de noviembre de 2025 (hora local)
const START_DATE = new Date(2025, 10, 25, 0, 0, 0);

// 2. MENSAJE DE LA CARTA
const LETTER_MESSAGE =
  "Parece mentira que ya haya pasado un año desde que empezó esta historia juntos. " +
  "Gracias por cada risa, cada abrazo, cada consejo y por hacerme sentir tan feliz " +
  "a tu lado. Eres mi persona favorita y mi mejor aventura. ¡Feliz primer aniversario, mi amor! ❤️";

// --- ABRIR SOBRE INICIAL ---
const envelopeWrapper = document.getElementById("open-envelope");
const introScreen = document.getElementById("intro-screen");
const mainContent = document.getElementById("main-content");
const floatingControls = document.getElementById("floating-controls");
const bgMusic = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");

envelopeWrapper.addEventListener("click", () => {
  envelopeWrapper.classList.add("open");
  launchHearts(15);

  bgMusic.play().then(() => {
    musicBtn.classList.add("active");
    musicBtn.textContent = "🔊";
  }).catch(() => {
    musicBtn.textContent = "🔇";
  });

  setTimeout(() => {
    introScreen.classList.add("fade-out");
    mainContent.classList.remove("hidden");
    floatingControls.classList.remove("hidden");
    startTypewriter();
  }, 900);
});

// --- TEMA Y MÚSICA ---
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.body.classList.toggle("dark-theme");
  themeBtn.textContent = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
});

musicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicBtn.textContent = "🔊";
      musicBtn.classList.add("active");
    }).catch(() => {});
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🔇";
    musicBtn.classList.remove("active");
  }
});

// --- TOQUE EN PERRITO CAMINANDO ---
const snoopyTrack = document.querySelector(".snoopy-walk-track");
if (snoopyTrack) {
  snoopyTrack.addEventListener("click", (e) => {
    e.stopPropagation();
    launchHearts(10);
  });
}

// --- CARRUSEL DE IMÁGENES ---
const track = document.getElementById("carousel-track");
const slides = Array.from(track.children);
const prevBtn = document.getElementById("prev-slide");
const nextBtn = document.getElementById("next-slide");
const dotsContainer = document.getElementById("carousel-dots");
const slideCounter = document.getElementById("slide-counter");

let currentIndex = 0;

slides.forEach((_, idx) => {
  const dot = document.createElement("button");
  dot.classList.add("dot");
  if (idx === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(idx));
  dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function goToSlide(index) {
  currentIndex = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  slideCounter.textContent = `${currentIndex + 1} / ${slides.length}`;

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === currentIndex);
  });
}

prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

let touchStartX = 0;
track.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 45) {
    if (diff > 0) goToSlide(currentIndex + 1);
    else goToSlide(currentIndex - 1);
  }
});

// --- BARRA DE PROGRESO ---
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById("scroll-progress").style.width = `${progress}%`;
});

// --- CORAZÓN AL TOCAR ---
mainContent.addEventListener("click", (e) => {
  if (
    e.target.closest("button") ||
    e.target.closest(".carousel-wrapper") ||
    e.target.closest(".snoopy-walk-track")
  ) return;

  const heart = document.createElement("div");
  heart.classList.add("tap-heart");
  heart.textContent = ["❤️", "💖", "✨", "💕"][Math.floor(Math.random() * 4)];
  heart.style.left = `${e.clientX}px`;
  heart.style.top = `${e.clientY}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
});

// --- CONTADOR EN TIEMPO REAL ---
function updateTimer() {
  const now = new Date();
  const diff = Math.max(0, now - START_DATE);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

setInterval(updateTimer, 1000);
updateTimer();

// --- EFECTO MÁQUINA DE ESCRIBIR ---
let charIndex = 0;
function startTypewriter() {
  const target = document.getElementById("typewriter-text");
  if (charIndex < LETTER_MESSAGE.length) {
    target.textContent += LETTER_MESSAGE.charAt(charIndex);
    charIndex++;
    setTimeout(startTypewriter, 35);
  }
}

// --- CORAZONES FLOTANTES ---
function launchHearts(amount) {
  const container = document.getElementById("hearts-container");
  const emojis = ["❤️", "💖", "💕", "✨", "🥰"];

  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.classList.add("floating-heart");
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = Math.random() * 95 + "vw";
      heart.style.animationDuration = (Math.random() * 1.5 + 2) + "s";
      container.appendChild(heart);

      setTimeout(() => heart.remove(), 3500);
    }, i * 80);
  }
}