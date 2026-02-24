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
  // URL du bouton (mode B)
  FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfdcjs-vcl4lns1d9nKIWcSpqJsSqdVl2EHe9cOaYcmxTXUag/viewform",

  // URL embed de l'iframe (mode A)
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
  initCountdown();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) {
    initNeuralCanvas();
  }
});

/* ════════════════════════════════════════════════
   1. APPLY FORM URLS
════════════════════════════════════════════════ */
function applyFormUrls() {
  const waitlistBtn = document.getElementById("waitlistBtn");
  if (waitlistBtn && CONFIG.FORM_URL !== "COLLER_ICI_URL_GOOGLE_FORM") {
    waitlistBtn.href = CONFIG.FORM_URL;
  }

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

  const closeMobileMenu = () => {
    const mobileMenu = document.getElementById("mobile-menu");
    const burger = document.querySelector(".nav__burger");
    if (mobileMenu && !mobileMenu.hidden) {
      mobileMenu.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();

      closeMobileMenu();

      const navH = nav.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    });
  });

  document.addEventListener("click", (e) => {
    const mobileMenu = document.getElementById("mobile-menu");
    const burger = document.querySelector(".nav__burger");
    if (
      mobileMenu &&
      mobileMenu.classList.contains("is-open") &&
      !mobileMenu.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
}

/* ════════════════════════════════════════════════
   3. MOBILE MENU
════════════════════════════════════════════════ */
function initMobileMenu() {
  const burger = document.querySelector(".nav__burger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!burger || !mobileMenu) return;

  // Forcer la fermeture sur desktop au chargement et au resize
  const checkDesktop = () => {
    if (window.innerWidth > 768) {
      mobileMenu.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  };
  window.addEventListener("resize", checkDesktop, { passive: true });
  checkDesktop();

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
  const targets = document.querySelectorAll(
    ".card, .pillar, .benefit, .pricing-card, .compare-table, .faq-item, .split__visual, .split__text, .hero__stats .stat"
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    const delay = (i % 3) * 0.1;
    el.style.transitionDelay = `${delay}s`;
  });

  if (!("IntersectionObserver" in window)) {
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
   7. WAVEFORM ANIMÉE
════════════════════════════════════════════════ */
function initWaveform() {
  const container = document.getElementById("waveformBars");
  if (!container) return;

  const barCount = 48;
  const bars = [];

  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("div");
    bar.className = "waveform__bar";
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
   8. CANVAS NEURAL
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

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

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

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(167,139,250,0.6)";
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  };

  draw();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }
  });
}

/* ════════════════════════════════════════════════
   9. COUNTDOWN
════════════════════════════════════════════════ */
function initCountdown() {
  const target = new Date('2026-10-23T00:00:00').getTime();

  const days    = document.getElementById('cd-days');
  const hours   = document.getElementById('cd-hours');
  const minutes = document.getElementById('cd-minutes');
  const seconds = document.getElementById('cd-seconds');

  if (!days) return;

  const pad = n => String(n).padStart(2, '0');

  const tick = () => {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      days.textContent = hours.textContent = minutes.textContent = seconds.textContent = '00';
      return;
    }

    days.textContent    = pad(Math.floor(diff / 86400000));
    hours.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    minutes.textContent = pad(Math.floor((diff % 3600000)  / 60000));
    seconds.textContent = pad(Math.floor((diff % 60000)    / 1000));
  };

  tick();
  setInterval(tick, 1000);
}


/* ════════════════════════════════════════════════
   10. HERO DASHBOARD ANIMATION
════════════════════════════════════════════════ */
function initHeroDashboard() {
  const svg       = document.getElementById('dashSvg');
  if (!svg) return;

  const focusLine  = document.getElementById('focusLine');
  const focusArea  = document.getElementById('focusArea');
  const synapLine  = document.getElementById('synapLine');
  const synapArea  = document.getElementById('synapArea');
  const warnMarker = document.getElementById('warnMarker');
  const statusDot  = document.getElementById('dashStatusDot');
  const statusLbl  = document.getElementById('dashStatusLabel');
  const metricFoc  = document.getElementById('metricFocus');
  const metricDmn  = document.getElementById('metricDaemon');
  const logLines   = document.getElementById('dashLogLines');

  const W = 600, H = 130, N = 80;
  let tick = 0;
  let phase = 'STABLE';
  let phaseTimer = 0;

  const PHASES = ['STABLE','WARNING','CRASH','RECOVERY','RESTORED'];
  const DURATIONS = { STABLE:3200, WARNING:1800, CRASH:2200, RECOVERY:3000, RESTORED:2800 };

  const LOGS = {
    STABLE:   [{t:0,c:'#34d399',tx:'FOCUS_STATE: deep_work_active — score: 94/100'},{t:900,c:'#34d399',tx:'ATTENTION_SPAN: 47min continuous — optimal'},{t:1800,c:'#34d399',tx:'COGNITIVE_LOAD: nominal — threads: 3 active'}],
    WARNING:  [{t:0,c:'#fbbf24',tx:'SLACK_DAEMON: incoming_notification detected'},{t:600,c:'#fbbf24',tx:'DISTRACTION_EVENT: context_switch_initiated'},{t:1200,c:'#f87171',tx:'CRITICAL_WARNING: interruption_slack — focus breach'}],
    CRASH:    [{t:0,c:'#f87171',tx:'FOCUS_STATE: collapsed — score: 11/100'},{t:700,c:'#f87171',tx:'COGNITIVE_RECOVERY: ETA 23min without intervention'},{t:1400,c:'#f87171',tx:'DEEP_WORK_LOSS: session_terminated — productivity: 0%'}],
    RECOVERY: [{t:0,c:'#60a5fa',tx:'SYNAPSEAR_DAEMON: activated — scanning EEG signal'},{t:700,c:'#60a5fa',tx:'AUDIO_ENGINE: injecting generative_focus_track_v3'},{t:1400,c:'#60a5fa',tx:'NEURO_LOOP: closed — binaural_sync: 12Hz theta'}],
    RESTORED: [{t:0,c:'#34d399',tx:'FOCUS_STATE: restored — score: 89/100 (+78pts)'},{t:800,c:'#34d399',tx:'RECOVERY_TIME: 9.4s vs baseline 23min — delta: −97%'},{t:1600,c:'#34d399',tx:'SYNAPSEAR_DAEMON: standing_by — monitoring active'}],
  };

  function pts(arr) {
    return arr.map((p,i)=>{
      const px=(p.x/100)*W, py=(p.y/100)*H;
      return `${i===0?'M':'L'}${px.toFixed(1)},${py.toFixed(1)}`;
    }).join(' ');
  }
  function area(arr) {
    if(!arr.length) return '';
    const l=arr[arr.length-1], f=arr[0];
    return `${pts(arr)} L${((l.x/100)*W).toFixed(1)},${H} L${((f.x/100)*W).toFixed(1)},${H} Z`;
  }

  function genFocus(ph) {
    const a=[];
    for(let i=0;i<N;i++){
      const x=(i/(N-1))*100, pos=i/N;
      let y;
      if(ph==='STABLE'||ph==='RESTORED') y=20+Math.sin(pos*8+tick*0.8)*4+Math.sin(pos*3+tick*0.3)*2;
      else if(ph==='WARNING'){const d=pos<0.65?0:(pos-0.65)/0.35; y=20+Math.sin(pos*8+tick*0.8)*4-d*18;}
      else if(ph==='CRASH'){y=pos<0.5?20-pos*36:2+Math.sin(pos*12)*2;}
      else{const r=pos>0.3?((pos-0.3)/0.7)*18:0; y=2+r+Math.sin(pos*10+tick)*2;}
      a.push({x,y:Math.max(1,Math.min(98,y))});
    }
    return a;
  }

  function genSynap(ph) {
    if(ph!=='RECOVERY'&&ph!=='RESTORED') return [];
    const a=[];
    for(let i=0;i<N;i++){
      const x=(i/(N-1))*100, pos=i/N;
      let y;
      if(ph==='RECOVERY'){if(pos<0.25){a.push({x,y:98});continue;} const r=(pos-0.25)/0.75; y=98-r*78+Math.sin(pos*15+tick*2)*3;}
      else{y=18+Math.sin(pos*10+tick*1.2)*5+Math.cos(pos*6+tick*0.6)*3;}
      a.push({x,y:Math.max(1,Math.min(98,y))});
    }
    return a;
  }

  function setPhaseUI(ph) {
    const colors = {STABLE:'#34d399',WARNING:'#fbbf24',CRASH:'#f87171',RECOVERY:'#60a5fa',RESTORED:'#34d399'};
    const labels = {STABLE:'NOMINAL',WARNING:'WARNING',CRASH:'CRITICAL',RECOVERY:'RECOVERING',RESTORED:'RESTORED'};
    const scores = {STABLE:'94/100',WARNING:'62/100',CRASH:'11/100',RECOVERY:'45/100',RESTORED:'89/100'};
    statusDot.style.background = colors[ph];
    statusLbl.style.color = colors[ph];
    statusLbl.textContent = labels[ph];
    metricFoc.style.color = colors[ph];
    metricFoc.textContent = scores[ph];
    const isActive = ph==='RECOVERY'||ph==='RESTORED';
    metricDmn.style.color = isActive?'#60a5fa':'#33335a';
    metricDmn.textContent = isActive?'ACTIVE':'STANDBY';
    warnMarker.style.display = (ph==='WARNING'||ph==='CRASH'||ph==='RECOVERY'||ph==='RESTORED')?'block':'none';
  }

  function addLog(c, tx) {
    const ts = new Date().toISOString().substr(11,12);
    const el = document.createElement('div');
    el.className = 'dash__log-entry';
    el.innerHTML = `<span class="dash__log-ts">${ts}</span><span style="color:${c}">${tx}</span>`;
    logLines.appendChild(el);
    // Keep max 5 lines
    while(logLines.children.length > 5) logLines.removeChild(logLines.firstChild);
  }

  let phaseIdx = 0;
  function nextPhase() {
    phase = PHASES[phaseIdx % PHASES.length];
    setPhaseUI(phase);
    // Schedule logs
    (LOGS[phase]||[]).forEach(({t,c,tx}) => setTimeout(()=>addLog(c,tx), t));
    phaseIdx++;
    setTimeout(nextPhase, DURATIONS[phase]);
  }
  nextPhase();

  // Animation loop
  function draw() {
    tick += 0.05;
    const fp = genFocus(phase);
    const sp = genSynap(phase);
    focusLine.setAttribute('d', pts(fp));
    focusArea.setAttribute('d', area(fp));
    synapLine.setAttribute('d', sp.length ? pts(sp) : '');
    synapArea.setAttribute('d', sp.length ? area(sp) : '');
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', initHeroDashboard);
