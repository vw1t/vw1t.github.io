/* =============================================
   vw1t Portfolio — script.js
   ============================================= */

// ─── CURSOR ───────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
// Smooth trail
function animateTrail() {
  const tx = parseFloat(cursorTrail.style.left) || mx;
  const ty = parseFloat(cursorTrail.style.top)  || my;
  cursorTrail.style.left = tx + (mx - tx) * 0.15 + 'px';
  cursorTrail.style.top  = ty + (my - ty) * 0.15 + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Scale cursor on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ─── CANVAS PARTICLES ─────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => { resize(); initParticles(); });
resize();

function initParticles() {
  particles = [];
  const count = Math.floor(W * H / 10000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6
        ? `rgba(139,92,246,`
        : Math.random() > 0.5
          ? `rgba(6,182,212,`
          : `rgba(226,232,240,`
    });
  }
}
initParticles();

// Mouse influence
let mouseX = W / 2, mouseY = H / 2;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    // Drift toward mouse slightly
    const dxM = mouseX - p.x, dyM = mouseY - p.y;
    const dist = Math.sqrt(dxM * dxM + dyM * dyM);
    if (dist < 200) {
      p.x += dxM * 0.0005;
      p.y += dyM * 0.0005;
    }
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();
  });
  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139,92,246,${0.05 * (1 - d / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ─── NAV SCROLL ───────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── TYPING ANIMATION ─────────────────────────
const phrases = [
  'Пишу интерфейсы, которые работают.',
  'HTML · CSS · JavaScript',
  'Адаптивные & красивые сайты.',
  'Открыт к новым проектам.',
  'Жду именно тебя! 🚀'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typedEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 55);
  } else {
    charIdx--;
    typedEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 350);
      return;
    }
    setTimeout(typeLoop, 28);
  }
}
typeLoop();

// ─── SCROLL REVEAL ────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .skill-item').forEach(el => observer.observe(el));

// ─── COUNTER ANIMATION ────────────────────────
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(tick);
  };
  tick();
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) counterObserver.observe(statsEl);

// ─── HERO AVATAR TILT ─────────────────────────
const avatarWrap = document.querySelector('.hero-avatar-wrap');
if (avatarWrap) {
  avatarWrap.addEventListener('mousemove', e => {
    const rect = avatarWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width  * 20;
    const dy = (e.clientY - cy) / rect.height * 20;
    avatarWrap.style.transform = `perspective(600px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
  avatarWrap.addEventListener('mouseleave', () => {
    avatarWrap.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
    avatarWrap.style.transition = 'transform 0.5s ease';
  });
}

// ─── SMOOTH ANCHOR SCROLL ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── PROJECT CARD SHIMMER ON HOVER ────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(139,92,246,0.06) 0%, var(--bg) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = 'var(--bg)';
  });
});
