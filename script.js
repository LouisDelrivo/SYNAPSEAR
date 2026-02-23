/* ═══════════════════════════════════════════════════════════════
   SYNAPSEAR — JavaScript
   ═══════════════════════════════════════════════════════════════

   ╔══════════════════════════════════════════════╗
   ║  CONFIGURATION — À PERSONNALISER             ║
   ╠══════════════════════════════════════════════╣
   ║  1. Créez votre Google Form (voir README.md) ║
   ║  2. Collez les URLs ci-dessous               ║
   ╚══════════════════════════════════════════════╝
*/

const CONFIG = {
  // URL du bouton (mode B) → ex: "https://forms.gle/XXXXXXXXXXXX"
  FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfdcjs-vcl4lns1d9nKIWcSpqJsSqdVl2EHe9cOaYcmxTXUag/viewform",

  // URL embed de l'iframe (mode A) → ex: "https://docs.google.com/forms/d/.../viewform?embedded=true"
  FORM_EMBED_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfdcjs-vcl4lns1d9nKIWcSpqJsSqdVl2EHe9cOaYcmxTXUag/viewform?embedded=true",
};

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  applyFormUrls();
  initNav();
  initMobileMenu();
  initFAQ();
  initModeSwitch();
  initRevealObserver();
  initWaveform();

  // Canvas neural uniquement si pas prefers-reduced-motion
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) {
    initNeuralCanvas();
  }
});

/* ════════════════════════════════════════════════
   1. APPLY FORM URLS
════════════════════════════════════════════════ */
function applyFormUrls() {
  // Bouton mode B
  const waitlistBtn = document.getElementById("waitlistBtn");
  if (waitlistBtn && CONFIG.FORM_URL !== "COLLER_ICI_URL_GOOGLE_FORM") {
    waitlistBtn.href = CONFIG.FORM_URL;
  }

  // Iframe mode A
  const iframe = document.getElementById("googleFormIframe");
  if (iframe && CONFIG.FORM_EMBED_URL !== "COLLER_ICI_URL_GOOGLE_FORM_EMBED") {
    iframe.src = CONFIG.FORM_EMBED_URL;
  }
}

/* ════════════════════════════════════════════════
   2. NAV — scroll state
════════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const update = () => {
    if (window.scrollY > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  update();

  // Smooth scroll pour tous les liens d'ancre internes
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = nav.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });

      // Fermer menu mobile si ouvert
      const mobileMenu = document.getElementById("mobile-menu");
      const burger = document.querySelector(".nav__burger");
      if (mobileMenu && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  });
}

/* ════════════════════════════════════════════════
   3. MOBILE MENU
════════════════════════════════════════════════ */
function initMobileMenu() {
  const burger = document.querySelector(".nav__burger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!burger || !mobileMenu) return;

  burger.addEventListener("click", () => {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    burger.setAttribute("aria-expanded", String(!isOpen));
    document.body.style.overflow = isOpen ? "" : "hidden";
  });
}

/* ════════════════════════════════════════════════
   4. FAQ — accordion accessible
════════════════════════════════════════════════ */
function initFAQ() {
  const buttons = document.querySelectorAll(".faq-item__q");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const answerId = btn.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);
      if (!answer) return;

      // Fermer les autres
      buttons.forEach((b) => {
        if (b !== btn) {
          b.setAttribute("aria-expanded", "false");
          const aId = b.getAttribute("aria-controls");
          const a = document.getElementById(aId);
          if (a) a.hidden = true;
        }
      });

      btn.setAttribute("aria-expanded", String(!expanded));
      answer.hidden = expanded;
    });
  });
}

/* ════════════════════════════════════════════════
   5. MODE SWITCH (formulaire)
════════════════════════════════════════════════ */
function initModeSwitch() {
  const btnA = document.getElementById("btnModeA");
  const btnB = document.getElementById("btnModeB");
  const modeA = document.getElementById("modeA");
  const modeB = document.getElementById("modeB");
  if (!btnA || !btnB || !modeA || !modeB) return;

  btnA.addEventListener("click", () => {
    modeA.classList.remove("hidden");
    modeB.classList.add("hidden");
    btnA.classList.add("mode-btn--active");
    btnB.classList.remove("mode-btn--active");
    btnA.setAttribute("aria-pressed", "true");
    btnB.setAttribute("aria-pressed", "false");
  });

  btnB.addEventListener("click", () => {
    modeB.classList.remove("hidden");
    modeA.classList.add("hidden");
    btnB.classList.add("mode-btn--active");
    btnA.classList.remove("mode-btn--active");
    btnB.setAttribute("aria-pressed", "true");
    btnA.setAttribute("aria-pressed", "false");
  });
}

/* ════════════════════════════════════════════════
   6. REVEAL ON SCROLL
════════════════════════════════════════════════ */
function initRevealObserver() {
  // Ajouter la classe reveal aux éléments cibles
  const targets = document.querySelectorAll(
    ".card, .pillar, .benefit, .pricing-card, .compare-table, .faq-item, .split__visual, .split__text, .hero__stats .stat"
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    // Décalage progressif par groupe de 3
    const delay = (i % 3) * 0.1;
    el.style.transitionDelay = `${delay}s`;
  });

  if (!("IntersectionObserver" in window)) {
    // Fallback : tout montrer
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ════════════════════════════════════════════════
   7. WAVEFORM ANIMÉE (barre générée en JS)
════════════════════════════════════════════════ */
function initWaveform() {
  const container = document.getElementById("waveformBars");
  if (!container) return;

  const barCount = 48;
  const bars = [];

  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("div");
    bar.className = "waveform__bar";
    // Profil de hauteur : pic au centre, chute aux extrémités
    const pos = i / barCount;
    const baseH = Math.sin(pos * Math.PI) * 0.7 + 0.15;
    bar.style.height = `${Math.round(baseH * 80)}px`;
    bar.style.setProperty("--peak", (0.4 + Math.random() * 0.6).toFixed(2));
    bar.style.animationDelay = `${(i * 0.04).toFixed(2)}s`;
    bar.style.animationDuration = `${(1.2 + Math.random() * 0.8).toFixed(2)}s`;
    container.appendChild(bar);
    bars.push(bar);
  }
}

/* ════════════════════════════════════════════════
   8. CANVAS NEURAL (connexions animées)
════════════════════════════════════════════════ */
function initNeuralCanvas() {
  const canvas = document.getElementById("neuralCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const nodes = [];
  const NODE_COUNT = 50;
  const MAX_DIST = 160;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();

  window.addEventListener("resize", resize, { passive: true });

  // Créer les nœuds
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.5 + Math.random() * 1.5,
    });
  }

  let raf;

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Déplacer les nœuds
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Dessiner les connexions
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Dessiner les nœuds
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(167,139,250,0.6)";
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  };

  draw();

  // Pause si l'onglet est caché (performance)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }
  });
}
