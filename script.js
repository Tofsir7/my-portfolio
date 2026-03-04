/* =============================================
   PORTFOLIO SCRIPT — Md Khayrul Hassan Khan
   ============================================= */

/* ---- Particle System ---- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '99, 102, 241' : '34, 211, 238';
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.twinkleDir = 1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity += this.twinkleSpeed * this.twinkleDir;
    if (this.opacity >= 0.6 || this.opacity <= 0.05) this.twinkleDir *= -1;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${this.color}, 0.4)`;
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  particles = Array.from({ length: Math.min(count, 120) }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw subtle connection lines
  particles.forEach((p, i) => {
    particles.slice(i + 1, i + 4).forEach(p2 => {
      const dx = p.x - p2.x, dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  highlightNavLink();
});

function highlightNavLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinksEl.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ---- Typed text animation ---- */
const phrases = [
  'Backend Developer',
  'Competitive Programmer',
  'Node.js Engineer',
  'Problem Solver',
  'API Architect'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeWriter() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeWriter, 500);
      return;
    }
    setTimeout(typeWriter, 50);
  } else {
    typedEl.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 2000);
      return;
    }
    setTimeout(typeWriter, 80);
  }
}
setTimeout(typeWriter, 800);

/* ---- AOS (Animate on Scroll) ---- */
function initAOS() {
  const aosEls = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  aosEls.forEach(el => observer.observe(el));
}
initAOS();

/* ---- Contact Form ---- */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFormMsg('Please fill in all fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormMsg('Please enter a valid email address.', 'error');
    return;
  }

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Simulate sending (replace with actual API call if needed)
  setTimeout(() => {
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    submitBtn.disabled = false;
    form.reset();
    showFormMsg(`Thanks ${name}! Your message has been received. I'll get back to you soon!`, 'success');
  }, 1500);
});

function showFormMsg(msg, type) {
  formMsg.textContent = msg;
  formMsg.className = 'form-message ' + type;
  setTimeout(() => { formMsg.className = 'form-message'; formMsg.textContent = ''; }, 6000);
}

/* ---- Resume button (placeholder) ---- */
document.getElementById('resumeBtn').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Resume download will be available soon! You can contact me directly for my CV.');
});

/* ---- Smooth hover glow on skill cards ---- */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.12) 0%, rgba(255,255,255,0.04) 70%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ---- Tilt effect on contest cards ---- */
document.querySelectorAll('.contest-card, .project-card, .about-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    card.style.transform = `translateY(-4px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    card.style.perspective = '800px';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.perspective = '';
  });
});

/* ---- Scroll Progress indicator ---- */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  width: 0%; transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(99,102,241,0.6);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
});

/* ---- Grid overlay (subtle developer aesthetic) ---- */
const gridEl = document.createElement('div');
gridEl.style.cssText = `
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%);
`;
document.body.insertBefore(gridEl, document.body.firstChild);
