(() => {
  const recipient = "chrisceo@qlairchat.com";

  function setupContactForm() {
    const contactModal = document.getElementById("contact-modal");
    const contactForm = document.getElementById("contact-form");
    const formNote = document.getElementById("form-note");

    if (!contactModal || !contactForm || !formNote) {
      return;
    }

    function openContactModal() {
      contactModal.classList.add("is-open");
      contactModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      formNote.textContent = "";
      contactModal.querySelector("input")?.focus();
    }

    function closeContactModal() {
      contactModal.classList.remove("is-open");
      contactModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }

    document.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-contact-open]");
      const closeButton = event.target.closest("[data-contact-close]");

      if (openButton) {
        openContactModal();
      }

      if (closeButton) {
        closeContactModal();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && contactModal.classList.contains("is-open")) {
        closeContactModal();
      }
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const company = String(data.get("company") || "").trim();
      const message = String(data.get("message") || "").trim();
      const subject = `Qlair sales inquiry from ${company || name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        "",
        "Message:",
        message,
      ].join("\n");

      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      formNote.textContent =
        "Your email app is opening with this message addressed to Qlair sales.";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupContactForm);
  } else {
    setupContactForm();
  }
})();

const canvas = document.getElementById("particle-field");
const ctx = canvas.getContext("2d", { alpha: true });
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let width = 0;
let height = 0;
let dpr = 1;
let particles = [];
let rafId = 0;

const pointer = {
  x: window.innerWidth * 0.72,
  y: window.innerHeight * 0.38,
  targetX: window.innerWidth * 0.72,
  targetY: window.innerHeight * 0.38,
  active: false,
};

function particleCount() {
  const area = window.innerWidth * window.innerHeight;
  return Math.max(72, Math.min(190, Math.floor(area / 7800)));
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seedParticles();
}

function seedParticles() {
  const count = particleCount();
  particles = Array.from({ length: count }, (_, index) => {
    const column = index % 19;
    const row = Math.floor(index / 19);
    return {
      baseX: ((column + 0.5) / 19) * width + (Math.random() - 0.5) * 38,
      baseY:
        ((row + 0.5) / Math.ceil(count / 19)) * height +
        (Math.random() - 0.5) * 38,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      size: Math.random() > 0.82 ? 3.8 : 2.4,
      phase: Math.random() * Math.PI * 2,
      drift: 0.5 + Math.random() * 1.2,
    };
  });
}

function drawParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(a, b, opacity) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function tick(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.62)";

  pointer.x += (pointer.targetX - pointer.x) * 0.1;
  pointer.y += (pointer.targetY - pointer.y) * 0.1;

  for (const particle of particles) {
    const floatX = Math.cos(time * 0.0003 * particle.drift + particle.phase) * 9;
    const floatY = Math.sin(time * 0.00036 * particle.drift + particle.phase) * 9;
    const homeX = particle.baseX + floatX;
    const homeY = particle.baseY + floatY;
    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.hypot(dx, dy) || 1;
    const influence = Math.max(0, 1 - distance / 220);
    const pull = pointer.active ? influence * 0.055 : influence * 0.025;

    particle.vx += (homeX - particle.x) * 0.006 + dx * pull;
    particle.vy += (homeY - particle.y) * 0.006 + dy * pull;
    particle.vx *= 0.84;
    particle.vy *= 0.84;
    particle.x += particle.vx;
    particle.y += particle.vy;

    drawParticle(particle);
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 88) {
        drawLine(a, b, (1 - distance / 88) * 0.12);
      }
    }
  }

  rafId = requestAnimationFrame(tick);
}

function start() {
  if (mediaQuery.matches) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer.targetX = event.clientX;
  pointer.targetY = event.clientY;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});
if (typeof mediaQuery.addEventListener === "function") {
  mediaQuery.addEventListener("change", start);
} else if (typeof mediaQuery.addListener === "function") {
  mediaQuery.addListener(start);
}

resize();
start();
